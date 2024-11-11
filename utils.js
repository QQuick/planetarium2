// General utilities, possibly used in many places

/*
import datetime as dt
import math as mt

import numscrypt as ns
*/
/*
// Universal synonyms for package-specific datatypes
typesGen = {'coordinate': 'float32', 'colorComponent': 'float32', 'index': 'uint32'}
typesNs = {'float32': ns.float32, 'int32': ns.int32}
*/
/*
// Return numscrypt column vector from entries
def colVec (*entries):
    return ns.array (entries) .reshape (len (entries), 1)
*/
// Get radians from degrees
export function radFromDeg (degrees) {
    var result = (degrees / 180) * Math.PI;
    return result;
}

// Get degrees from radians
export function degFromRad (rad) {
    return (rad / Math.PI) * 180;
}

export var obliquity = radFromDeg (23.43928)
export var sinObliq = Math.sin (obliquity)
export var cosObliq = Math.cos (obliquity)

// Get equatorial coords from ecliptic coords
export function equatFromEclipt (x, y, z) {
    var result = [
        150e9 * x,
        150e9 * (cosObliq * y - sinObliq * z),
        150e9 * (sinObliq * y + cosObliq * z)
    ];
    return result;
}

/*
// Get right ascension and declination from x y z coords
export function raDecFromXyz (x, y, z):
    return (
        ((12/Math.PI) * Math.atan2 (y, x) + 24) % 24,
        (180/Math.PI) * Math.atan (z / Math.sqrt (x * x + y * y))
    );
*/

// Convert <hours>.<minutes> to <hours>.<decimal fraction>
export function decimalHours (hoursMinutes) {
    return Math.floor (hoursMinutes) + (100 / 60) * (hoursMinutes - Math.floor (hoursMinutes));
}

// Get julian day number from date and time, https://www.youtube.com/watch?v=_x1ga4dAzDo
export function julianDayNr (dateTime) {

    a = (14 - dateTime.month) / 12;
    y = dateTime.year + 4800 - a;
    m = dateTime.month + 12 * a - 3;

    jdnInt = dateTime.day + (153 * m + 2) / 5 + 365 * y + y/4 - y/100 + y/400 - 32045;

    secPerDay = 24 * 3600;
    sec = dateTime.hour * 3600 + dateTime.minute * 60 + dateTime.second;
    frac = sec / secPerDay;

    return jdnInt + frac;
}