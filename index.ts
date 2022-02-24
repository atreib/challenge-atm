/**
 * Challenge: ATM Withdrawal
 *   Given an amount (20 > amount > 2000), break it down into the minimum required quantity of hundred, fifty and twenty USD bills 
 *   Example:
 *     20 -> 2 twenty USD
 *     50 -> 1 fifty USD 
 *     70 -> 1 fifty USD and 1 twenty USD
 */

// Change this variable to test some values
const AMOUNT = 160;

// Initiate with 0 bills counted and the amount as remainder
const initialState = {
    hundred: 0,
    fifty: 0,
    twenty: 0,
    remainder: AMOUNT,
};
type StateType = typeof initialState;

// Enum to (try to) ease the readability
enum Bill {
    HUNDRED = "hundred",
    FIFTY = "fifty",
    TWENTY = "twenty",
}

// Object to store the value of each bill (according to the Enum)
const billValue: { [d in Bill]: number } = {
    [Bill.HUNDRED]: 100,
    [Bill.FIFTY]: 50,
    [Bill.TWENTY]: 20,
}

// Helper type to ease readability
type Operation = {
    bill: Bill;
    quantity: number;
    isSum: boolean;
}

/**
 * Decides what to do in order to achieve the goal, based on the provided status
 *   Recursive: it's going to keep calling itself until finished its goal
 * _state: the current state
 * operation: the requested operation (add or remove X bills from state)
 * returns new state
 */
const ratio = (_state: StateType, operation?: Operation): StateType => {
    let state = { ..._state }; // Copy state

    // If some operation was sent
    if (operation) {
        const { bill, quantity, isSum } = operation; // Destruct to ease readability

        // Apply the operation into the state
        state = {
            ...state,
            [bill]: isSum ? state[bill] + quantity : state[bill] - quantity,
            remainder: isSum ? state.remainder - (quantity * billValue[bill]) : state.remainder + (quantity * billValue[bill]),
        }
    }

    // Helper to check if there still no bills counted (in the state)
    const noBills = state.hundred === 0 && state.fifty === 0 && state.twenty === 0;

    // If there's no remainder, we end here (return the state)
    if (state.remainder === 0) return state;

    // If there's no bills counted and the amount/remainder is less than 20, we can't process
    if (noBills && state.remainder < billValue[Bill.TWENTY]) throw new Error("Less than 20");

    // If we can divide the amount/remainer by 100 without new remainders, do it (1 time - add 1 one hundred bill)
    if (state.remainder % billValue[Bill.HUNDRED] === 0) return ratio(state, { bill: Bill.HUNDRED, quantity: 1, isSum: true });

    // If we can divide the amount/remainer by 50 without new remainders, do it (1 time - add 1 fifty bill)
    if (state.remainder % billValue[Bill.FIFTY] === 0) return ratio(state, { bill: Bill.FIFTY, quantity: 1, isSum: true });

    // If we can divide the amount/remainer by 20 without new remainders, do it (1 time - add 1 twenty bill)
    if (state.remainder % billValue[Bill.TWENTY] === 0) return ratio(state, { bill: Bill.TWENTY, quantity: 1, isSum: true });

    // Special treatments for 50 + (20 *1, *2, *3 or *4)
    // I don't overthink about it because I'm already tired, but these scenarios need this special treatment 
    // (Yeah, I don't know why for sure - yet)
    for (let i = 1; i <= 4; i++) {
        const combo = state.remainder - (billValue[Bill.TWENTY] * i);
        if (combo % billValue[Bill.FIFTY] === 0) return ratio(state, { bill: Bill.TWENTY, quantity: i, isSum: true });
    }
    
    // If no scenarios were satisfied, something is wrong... Add a console.log here to check it out
    throw new Error("Something remainded");
};

try {
    const finalRatio = ratio(initialState);
    console.log("*** SUCCESS!");
    console.log(finalRatio);
} catch (err) {
    console.log("*** FAIL");
    console.error(err);
}
