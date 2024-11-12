// Compute positions of planets in equatorial coordinates.
// Basic data and formulae underlying this module are in background_literature folder.

// import datetime as dt

import * as ut from "./utils.js";

import * as cv from "./canvas.js";

import * as tf from "./transforms.js";
import * as pc from "./planet_catalog.js";

var scaleFactor = 15;

var mPerAu = 149597871e14;

export class Planet {
    constructor (solarSystem, name, basicOrbitElements, extraOrbitElements, period, radius, color) {
        this.name = name
        this.solarSystem = solarSystem;
        this.basicOrbitElements = basicOrbitElements;
        this.extraOrbitElements = extraOrbitElements;
        this.period = period;
        this.radius = radius;
        this.color = color;
    }

    setEquatPosition () {
        this.equatPosition = this.computeEquatOrbit (1)[0];
    }

    setEquatOrbit () {
        this.equatOrbit = this.computeEquatOrbit (180);
    }

    setEarthViewPosition () {
/*
        var rotatedPosition = tf.matVecMul (this.solarSystem.planetarium.rotZyxMat, tf.vecSub (this.equatPosition, this.solarSystem.earth.equatPosition));
*/
        var rotatedPosition = tf.matVecMul ([[1, 0, 0], [0, 1, 0], [0, 0, 1]], tf.vecSub (this.equatPosition, this.solarSystem.earth.equatPosition));
        this.earthViewPosition = tf.getStereographicProjection (rotatedPosition, this.solarSystem.getViewDistance ());
    }

    setFarViewOrbit () {
        this.farViewOrbit = [];
        for (let equatPosition of this.equatOrbit) {
            this.farViewOrbit.push (tf.getProjection (tf.vecSub (this.equatPostion, [30, 30, 10]), this.solarSystem.getViewDistance))
        }
    }

    computeEquatOrbit (orbitSteps) {
        var a_0 = this.basicOrbitElements [0][0];
        var a_der = this.basicOrbitElements [1][0];

        var e_0 = this.basicOrbitElements [0][1];
        var e_der = this.basicOrbitElements [1][1];

        var I_0 = this.basicOrbitElements [0][2];
        var I_der = this.basicOrbitElements [1][2];

        var L_0 = this.basicOrbitElements [0][3];
        var L_der = this.basicOrbitElements [1][3];

        var om_bar_0 = this.basicOrbitElements [0][4];
        var om_bar_der = this.basicOrbitElements [1][4];

        var Om_0 = this.basicOrbitElements [0][5];
        var Om_der = this.basicOrbitElements [1][5];

        // var t_0 = ut.julianDayNr (dt.datetime (*this.solarSystem.getYmdHms ())) - ut.julianDayNr (dt.datetime (2000, 1, 1, 0, 0, 0))
        // var t_0 = ut.julianDayNr (dt.datetime.now ()) - ut.julianDayNr (dt.datetime (2000, 1, 1, 0, 0, 0));
        var t_0 = 0;

        for (let i = 0; i < orbitSteps; i++) {
            var t = t_0 + i * this.period / orbitSteps;

            var daysPerCentury = 36525;
            var T = t / daysPerCentury;

            var a = a_0 + a_der * T;
            var e = e_0 + e_der * T;
            var I = I_0 + I_der * T;
            var L = L_0 + L_der * T;
            var om_bar = om_bar_0 + om_bar_der * T;
            var Om = Om_0 + Om_der * T;

            var b = this.extraOrbitElements [0];
            var c = this.extraOrbitElements [1];
            var s = this.extraOrbitElements [2];
            var f = this.extraOrbitElements [3];

            var om = om_bar - Om;
            var M = L - om_bar + b * T * T + c * Math.cos (ut.radFromDeg (f * T)) + s * Math.sin (ut.radFromDeg (f * T));

            M = M % 360;

            if (M > 180) {
                M = M - 360;
            }

            var e_star = ut.degFromRad (e);
            var E = M +  e_star * Math.sin (ut.radFromDeg (M));

            var tol = 1e-6;
            var del_E = 1e10;

            while (del_E > tol) {
                var del_M = M - (E - e_star * Math.sin (ut.radFromDeg (E)));
                del_E = del_M / (1 - e * Math.cos (ut.radFromDeg (E)));
                E = E + del_E;
            }

            var xAccent = a * (Math.cos (ut.radFromDeg (E)) - e);
            var yAccent = a * Math.sqrt (1 - e * e) * Math.sin (ut.radFromDeg (E));
            var zAccent = 0;

            var equatOrbit = [];

            equatOrbit.push (ut.equatFromEclipt (
                (Math.cos (ut.radFromDeg (om)) * Math.cos (ut.radFromDeg (Om)) - Math.sin (ut.radFromDeg (om)) * Math.sin (ut.radFromDeg (Om)) * Math.cos (ut.radFromDeg (I))) * xAccent +
                (-Math.sin (ut.radFromDeg (om)) * Math.cos (ut.radFromDeg (Om)) - Math.cos (ut.radFromDeg (om)) * Math.sin (ut.radFromDeg (Om)) * Math.cos (ut.radFromDeg (I))) * yAccent,

                (Math.cos (ut.radFromDeg (om)) * Math.sin (ut.radFromDeg (Om)) + Math.sin (ut.radFromDeg (om)) * Math.cos (ut.radFromDeg (Om)) * Math.cos (ut.radFromDeg (I))) * xAccent +
                (-Math.sin (ut.radFromDeg (om)) * Math.sin (ut.radFromDeg (Om)) + Math.cos (ut.radFromDeg (om)) * Math.cos (ut.radFromDeg (Om)) * Math.cos (ut.radFromDeg (I))) * yAccent,

                Math.sin (ut.radFromDeg (om)) * Math.sin (ut.radFromDeg (I)) * xAccent +
                Math.cos (ut.radFromDeg (om)) * Math.sin (ut.radFromDeg (I)) * yAccent
            ));
        }

        return equatOrbit;
    }
}

export class SolarSystem {
    /*
    constructor (planetarium, getYmdHms, getViewDistance) {
        this.planetarium = planetarium;
        this.getYmdHms = getYmdHms;
        this.getViewDistance = getViewDistance;
    */
    constructor (getViewDistance) {
        this.getViewDistance = getViewDistance;

        this.planets = [];
        for (let args of pc.planetCatalog) {
            this.planets.push (new Planet (this, ...args));
        }

        this.earth = this.planets [2];
    }

    setEquatPositions () {
        for (let planet of this.planets) {
            planet.setEquatPosition ();
        }
    }

    setEquatOrbits () {
        for (let planet of this.planets) {
            planet.setEquatOrbit ();
        }
    }

    setEarthViewPositions () {
        for (let planet of this.planets) {
            planet.setEarthViewPosition ();
        }
    }

    setFarViewOrbits () {
        for (let planet of this.planets) {
            planet.setFarViewOrbit ();
        }
    }

    printPositions () {
        for (let planet of this.planets) {
            alert (444);
            alert (planet.name);
            alert (planet.equatPosition);
            // alert (planet.earthViewPosition);
            alert (555);
        }
    }

    showPositions () {
        for (let planet of this.planets) {
            var square = new cv.Square (scaleFactor * planet.equatPosition [0], scaleFactor * planet.equatPosition [1], 10, planet.color);
            square.draw ();
            // alert (planet.name + " " + x + " " + y);
        }
    }
}

function getViewDistance () {
    return 0.8;
}

var solarSystem = new SolarSystem (getViewDistance)
solarSystem.setEquatPositions ()
solarSystem.setEarthViewPositions ()
// solarSystem.printPositions ()
solarSystem.showPositions ()