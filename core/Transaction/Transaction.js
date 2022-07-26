class Transaction {
    constructor(wrapper) {
        this._wrapper = wrapper;
    }
    perform(method) {
        const wrapperValue = this._wrapper.initialize();
        method();
        this._wrapper.close(wrapperValue);
    }
}

export default Transaction
