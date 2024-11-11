export function vecDot (v0, v1) {
    return v0 [0] * v1 [0] + v0 [1] * v1 [1] + v0 [2] * v1 [2];
}

export function vecSub (v0, v1) {
    return [v0 [0] - v1 [0], v0 [1] - v1 [1], v0 [1] - v1 [1]];
}

export function matMul (m0, m1) {
    var nrOfTargetRows = m0.length;
    var nrOfTargetColumns = m1 [0].length;
    var nrOfTerms = m0 [0] .length;
    var result = [];
    for (let targetRowIndex = 0; targetRowIndex < nrOfTargetRows; targetRowIndex++) {
        result.push ([]);
        for (let targetColumnIndex = 0; targetColumnIndex < nrOfTargetRows; targetColumnIndex++) {
            result [targetRowIndex] .push (0)
            for (let termIndex = 0; termIndex < nrOfTerms; termIndex++) {
                result [targetRowIndex][targetColumnIndex] += m0 [targetRowIndex][termIndex] * m1 [termIndex][targetColumnIndex];
            }
        }
    }
    return result;
}

/*
alert (matMul (
    [   [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ],
    [   [2, 4, 6],
        [8, 10, 12],
        [14, 16, 18]
    ]
))
*/

export function getRotXMat (angle) {
    var c = Math.cos (angle);
    var s = Math.sin (angle);
    return [
        [1, 0, 0],
        [0, c, -s],
        [0, s, c]
    ];
}

/*
alert (
    getRotXMat (3.14)
);
*/

export function getRotYMat (angle) {
    var c = Math.cos (angle);
    var s = Math.sin (angle);
    return [
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c]
    ];
}

export function getRotZMat (angle) {
    var c = Math.cos (angle);
    var s = Math.sin (angle);
    return[
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1]
    ];
}

export function getRotXyzMat (angleVec) {    // Z rotation first
    return matMul (
        getRotXMat (angleVec [2]),
        matMul (
            getRotYMat (angleVec [1]),
            getRotZMat (angleVec [0])
        )
    );
}

/*
alert (
    getRotXyzMat ([1, 2, 3])
)
*/

export function getRotXzyMat (angleVec) {
    return matMul (
        getRotXMat (angleVec [2]),
        matMul (
            getRotZMat (angleVec [1]),
            getRotYMat (angleVec [0])
        )
    );
}

export function getRotYxzMat (angleVec) {
    return matMul (
        getRotYMat (angleVec [2]),
        matMul (
            getRotXMat (angleVec [1]),
            getRotZMat (angleVec [0])
        )
    );
}

export function getRotYzxMat (angleVec) {
    return matMul (
        getRotYMat (angleVec [2]),
        matMul (
            getRotZMat (angleVec [1]),
            getRotXMat (angleVec [0])
        )
    );
}

export function getRotZxyMat (angleVec) {
    return matMul (
        getRotZMat (angleVec [2]),
        matMul (
            getRotXMat (angleVec [1]),
            getRotYMat (angleVec [0])
        )
    );
}

export function getRotZyxMat (angleVec) {
    return matMul (
        getRotZMat (angleVec [2]),
        matMul (
            getRotYMat (angleVec [1]),
            getRotXMat (angleVec [0])
        )
    );
}

export function getProjection (bodyVec, imageDist) {
    var scale = 400

    if (bodyVec [2] > 0) {
        return [
            -scale * Math.atan2 (bodyVec [0], bodyVec [2]),
            scale * Math.atan2 (bodyVec [1], bodyVec [2])
        ]
    }
    else {
        return None
    }
}

export function getNorm (vec) {
    return Math.sqrt (vecDot (vec, vec));

}

export function getNormalized (vec) {
    return vecDiv (vec, getNorm (vec));
}

// Source: https://en.wikipedia.org/wiki/Stereographic_projection
export function getStereographicProjection (bodyVec, imageDist) {
    if (bodyVec [2] < 0) {
        return None;
    }

    unitVec = getNormalized (bodyVec);
    result = ns.array ((
        400 * unitVec [0] / (1 - unitVec [2]),
        400 * unitVec [1] / (1 - unitVec [2])
    )) .tolist ();
    // print (result)
    return result;
}