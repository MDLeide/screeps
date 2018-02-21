/**
 * Screeps.com response for actions.
 */
export enum ActionResult {
    OK = 0,
    ERR_NOT_OWNER = -1,
    ERR_NO_PATH = -2,
    ERR_NAME_EXISTS = -3,
    ERR_BUSY = -4,
    ERR_NOT_FOUND = -5,
    ERR_NOT_ENOUGH_RESOURCES = -6,
    ERR_NOT_ENOUGH_ENERGY = -6,
    ERR_INVALID_TARGET = -7,
    ERR_FULL = -8,
    ERR_NOT_IN_RANGE = -9,
    ERR_INVALID_ARGS = -10,
    ERR_TIRED = -11,
    ERR_NO_BODYPART = -12
}
