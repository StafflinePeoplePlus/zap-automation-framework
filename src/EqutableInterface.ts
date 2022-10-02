export interface EqutableInterface {
    /**
     * Determines whether an object is equal to another.
     *
     * @param {EqutableInterface} other The object to be checked if equals this
     */
    isEqualTo(other: EqutableInterface): boolean
}
