/* ================================================================
   JAVASCRIPT FUNDAMENTALS ASSIGNMENT
   ================================================================ */

/* ============================================================
   CHALLENGE 1: ATM BANKING SYSTEM
   ============================================================ */

// ---------- Account State ----------
let userPin = "1234";
let currentBalance = 5000;
let selectedOperation = "";
let transactionAmount = 0;

// Bonus: lock account after 3 wrong PIN attempts
let failedAttempts = 0;
let isAccountLocked = false;

const MAX_ATTEMPTS = 3;

// ---------- Helper Functions ----------

function validatePin(enteredPin) {
  if (isAccountLocked) {
    console.log("❌ Account is locked. Please contact your bank.");
    return false;
  }

  if (enteredPin === userPin) {
    failedAttempts = 0; // reset counter on success
    return true;
  }

  failedAttempts++;
  console.log(`❌ Incorrect PIN. Attempt ${failedAttempts} of ${MAX_ATTEMPTS}.`);

  if (failedAttempts >= MAX_ATTEMPTS) {
    isAccountLocked = true;
    console.log("🔒 Account locked due to 3 incorrect PIN attempts.");
  }

  return false;
}

function withdraw(enteredPin, amount) {
  selectedOperation = "Withdraw";
  transactionAmount = amount;

  if (!validatePin(enteredPin)) return;

  if (amount <= 0) {
    console.log("❌ Withdrawal amount must be greater than zero.");
    return;
  }

  if (amount > currentBalance) {
    console.log("❌ Insufficient balance for this withdrawal.");
    return;
  }

  currentBalance -= amount;
  console.log(`✅ Withdrawal successful. New balance: ${currentBalance}`);
}

function deposit(enteredPin, amount) {
  selectedOperation = "Deposit";
  transactionAmount = amount;

  if (!validatePin(enteredPin)) return;

  if (amount <= 0) {
    console.log("❌ Deposit amount must be greater than zero.");
    return;
  }

  currentBalance += amount;
  console.log(`✅ Deposit successful. New balance: ${currentBalance}`);
}

function checkBalance(enteredPin) {
  selectedOperation = "Check Balance";

  if (!validatePin(enteredPin)) return;

  console.log(`💰 Current balance: ${currentBalance}`);
}

function changePin(enteredPin, newPin) {
  selectedOperation = "Change PIN";

  if (!validatePin(enteredPin)) return;

  const isFourDigits = /^\d{4}$/.test(newPin);

  if (!isFourDigits) {
    console.log("❌ New PIN must contain exactly 4 digits.");
    return;
  }

  userPin = newPin;
  console.log("✅ PIN changed successfully.");
}

// ---------- Test Runs ----------
console.log("---- ATM Banking System Test ----");

checkBalance("1234");        // ✅ correct PIN
deposit("1234", 1000);       // ✅ deposit
withdraw("1234", 2000);      // ✅ withdraw
withdraw("1234", 999999);    // ❌ insufficient balance
deposit("1234", -50);        // ❌ invalid amount
changePin("1234", "12345");  // ❌ not 4 digits
changePin("1234", "4321");   // ✅ pin changed
checkBalance("1234");        // ❌ old pin no longer valid
checkBalance("4321");        // ✅ new pin works

// ---- Bonus: Lock after 3 wrong attempts ----
console.log("\n---- Testing Account Lock ----");
withdraw("0000", 100); // wrong attempt 1
withdraw("0000", 100); // wrong attempt 2
withdraw("0000", 100); // wrong attempt 3 -> locked
withdraw("4321", 100); // even correct pin now fails, account locked


/* ============================================================
   CHALLENGE 2: E-COMMERCE CHECKOUT SYSTEM
   ============================================================ */

// ---------- Configuration ----------

// Discount percentage per product category
const categoryDiscounts = {
  electronics: 0.10, // 10%
  clothing: 0.20,    // 20%
  groceries: 0.05,   // 5%
  books: 0.0,        // no discount
};

// Valid coupon codes and their discount percentage
const validCoupons = {
  SAVE10: 0.10,
  SAVE20: 0.20,
  WELCOME5: 0.05,
};

// Payment methods that get an extra discount
const paymentMethodDiscounts = {
  wallet: 0.05,  // 5% extra discount for e-wallet payments
  card: 0.02,    // 2% extra discount for card payments
  cash: 0.0,     // no extra discount for cash
};

const VAT_RATE = 0.14; // 14% VAT

// ---------- Checkout Function ----------

function checkout({
  customerName,
  productCategory,
  productPrice,
  quantity,
  couponCode,
  paymentMethod,
}) {
  // 1. Subtotal
  const subtotal = productPrice * quantity;

  // 2. Category discount
  const categoryDiscountRate = categoryDiscounts[productCategory] || 0;
  const categoryDiscountAmount = subtotal * categoryDiscountRate;

  // 3. Coupon discount (applied on the subtotal after category discount)
  const priceAfterCategoryDiscount = subtotal - categoryDiscountAmount;
  const isCouponValid = Object.prototype.hasOwnProperty.call(validCoupons, couponCode);
  const couponDiscountRate = isCouponValid ? validCoupons[couponCode] : 0;
  const couponDiscountAmount = priceAfterCategoryDiscount * couponDiscountRate;

  // 4. Payment method discount
  const priceAfterCoupon = priceAfterCategoryDiscount - couponDiscountAmount;
  const paymentDiscountRate = paymentMethodDiscounts[paymentMethod] || 0;
  const paymentDiscountAmount = priceAfterCoupon * paymentDiscountRate;

  // 5. Price before VAT
  let priceBeforeVAT = priceAfterCoupon - paymentDiscountAmount;

  // Bonus: never allow a negative price
  if (priceBeforeVAT < 0) priceBeforeVAT = 0;

  // 6. VAT
  const vatAmount = priceBeforeVAT * VAT_RATE;
  const finalTotal = priceBeforeVAT + vatAmount;

  // ---------- Invoice ----------
  console.log("========== INVOICE ==========");
  console.log(`Customer:            ${customerName}`);
  console.log(`Category:            ${productCategory}`);
  console.log(`Unit Price:          ${productPrice}`);
  console.log(`Quantity:            ${quantity}`);
  console.log(`Subtotal:            ${subtotal.toFixed(2)}`);
  console.log(`Category Discount:   -${categoryDiscountAmount.toFixed(2)} (${categoryDiscountRate * 100}%)`);
  console.log(
    `Coupon (${couponCode}):        ${
      isCouponValid
        ? `-${couponDiscountAmount.toFixed(2)} (${couponDiscountRate * 100}%)`
        : "Invalid or not applied"
    }`
  );
  console.log(`Payment Discount:    -${paymentDiscountAmount.toFixed(2)} (${paymentMethod})`);
  console.log(`Price before VAT:    ${priceBeforeVAT.toFixed(2)}`);
  console.log(`VAT (${(VAT_RATE * 100).toFixed(0)}%):          +${vatAmount.toFixed(2)}`);
  console.log(`FINAL TOTAL:         ${finalTotal.toFixed(2)}`);
  console.log("==============================\n");

  return finalTotal;
}

// ---------- Test Runs ----------

checkout({
  customerName: "Ahmed Ali",
  productCategory: "electronics",
  productPrice: 1000,
  quantity: 2,
  couponCode: "SAVE10",
  paymentMethod: "wallet",
});

checkout({
  customerName: "Sara Mostafa",
  productCategory: "books",
  productPrice: 50,
  quantity: 1,
  couponCode: "INVALIDCODE",
  paymentMethod: "cash",
});

// Edge case: heavy discounts pushing total toward zero
checkout({
  customerName: "Omar Hassan",
  productCategory: "clothing",
  productPrice: 10,
  quantity: 1,
  couponCode: "SAVE20",
  paymentMethod: "wallet",
});


/* ============================================================
   CHALLENGE 3: UNIVERSITY STUDENT PORTAL
   ============================================================ */

// ---------- Configuration ----------
const REQUIRED_ATTENDANCE = 75; // minimum % attendance to be eligible
const PASSING_SCORE = 60;       // minimum total score to pass
const SCHOLARSHIP_SCORE = 90;   // minimum total score for scholarship

// Score weights (must add up to 1)
const WEIGHTS = {
  midterm: 0.3,
  final: 0.5,
  assignment: 0.2,
};

// ---------- Helper Functions ----------

function calculateTotalScore(midtermScore, finalExamScore, assignmentScore) {
  return (
    midtermScore * WEIGHTS.midterm +
    finalExamScore * WEIGHTS.final +
    assignmentScore * WEIGHTS.assignment
  );
}

function getLetterGrade(totalScore) {
  if (totalScore >= 90) return "A";
  if (totalScore >= 80) return "B";
  if (totalScore >= 70) return "C";
  if (totalScore >= 60) return "D";
  return "F";
}

// ---------- Main Function ----------

function showStudentResult({
  studentName,
  attendancePercentage,
  midtermScore,
  finalExamScore,
  assignmentScore,
  tuitionPaid,
}) {
  console.log(`========== ${studentName}'s Result ==========`);

  // Rule: unpaid tuition blocks access to results
  if (!tuitionPaid) {
    console.log("❌ Results unavailable: tuition payment is pending.");
    console.log("==============================================\n");
    return;
  }

  // Rule: attendance below required percentage = automatic fail
  if (attendancePercentage < REQUIRED_ATTENDANCE) {
    console.log(`Attendance:       ${attendancePercentage}%`);
    console.log(`Status:           FAIL (insufficient attendance)`);
    console.log("==============================================\n");
    return;
  }

  const totalScore = calculateTotalScore(midtermScore, finalExamScore, assignmentScore);
  const letterGrade = getLetterGrade(totalScore);
  const hasPassed = totalScore >= PASSING_SCORE;

  console.log(`Attendance:       ${attendancePercentage}%`);
  console.log(`Midterm Score:    ${midtermScore}`);
  console.log(`Final Exam Score: ${finalExamScore}`);
  console.log(`Assignment Score: ${assignmentScore}`);
  console.log(`Total Score:      ${totalScore.toFixed(2)}`);
  console.log(`Letter Grade:     ${letterGrade}`);
  console.log(`Status:           ${hasPassed ? "PASS" : "FAIL"}`);

  // Bonus: scholarship eligibility message
  if (hasPassed && totalScore >= SCHOLARSHIP_SCORE) {
    console.log("🏆 Congratulations! You are eligible for a scholarship.");
  }

  console.log("==============================================\n");
}

// ---------- Test Runs ----------

showStudentResult({
  studentName: "Mona Tarek",
  attendancePercentage: 80,
  midtermScore: 90,
  finalExamScore: 95,
  assignmentScore: 100,
  tuitionPaid: true,
}); // expected: PASS, A, scholarship eligible

showStudentResult({
  studentName: "Kareem Adel",
  attendancePercentage: 60,
  midtermScore: 85,
  finalExamScore: 90,
  assignmentScore: 80,
  tuitionPaid: true,
}); // expected: FAIL due to attendance

showStudentResult({
  studentName: "Nour Hesham",
  attendancePercentage: 85,
  midtermScore: 50,
  finalExamScore: 40,
  assignmentScore: 60,
  tuitionPaid: true,
}); // expected: FAIL due to low score

showStudentResult({
  studentName: "Youssef Emad",
  attendancePercentage: 90,
  midtermScore: 95,
  finalExamScore: 95,
  assignmentScore: 90,
  tuitionPaid: false,
}); // expected: results blocked, tuition unpaid


/* ============================================================
   LEETCODE PROBLEM 1: VALID PARENTHESES
   https://leetcode.com/problems/valid-parentheses/
   ============================================================ */

/**
 * Determines whether the input string of brackets is valid.
 * A string is valid if every opening bracket has a matching
 * closing bracket of the same type, in the correct order.
 *
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const matchingPairs = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  const stack = [];

  for (const char of s) {
    const isClosingBracket = char in matchingPairs;

    if (isClosingBracket) {
      const lastOpenBracket = stack.pop();

      // Stack empty or mismatched bracket -> invalid
      if (lastOpenBracket !== matchingPairs[char]) {
        return false;
      }
    } else {
      // It's an opening bracket, push it onto the stack
      stack.push(char);
    }
  }

  // Valid only if every opening bracket was matched and closed
  return stack.length === 0;
}

// ---------- Test Runs ----------
console.log(isValid("()"));       // true
console.log(isValid("()[]{}"));   // true
console.log(isValid("(]"));       // false
console.log(isValid("([)]"));     // false
console.log(isValid("{[]}"));     // true
console.log(isValid(""));         // true
console.log(isValid("(("));       // false


/* ============================================================
   LEETCODE PROBLEM 2: FIND THE INDEX OF THE FIRST OCCURRENCE
   https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
   ============================================================ */

/**
 * Returns the index of the first occurrence of `needle` in
 * `haystack`, or -1 if `needle` is not part of `haystack`.
 *
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
function strStr(haystack, needle) {
  const haystackLength = haystack.length;
  const needleLength = needle.length;

  // An empty needle is conventionally found at index 0
  if (needleLength === 0) return 0;

  for (let i = 0; i <= haystackLength - needleLength; i++) {
    const substring = haystack.substring(i, i + needleLength);

    if (substring === needle) {
      return i;
    }
  }

  return -1;
}

// ---------- Test Runs ----------
console.log(strStr("sadbutsad", "sad"));   // 0
console.log(strStr("leetcode", "leeto"));  // -1
console.log(strStr("hello", "ll"));        // 2
console.log(strStr("aaaaa", "bba"));       // -1
console.log(strStr("abc", ""));            // 0


