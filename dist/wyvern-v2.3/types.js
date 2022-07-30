"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSide = exports.OrderSaleKind = exports.OrderHowToCall = void 0;
var OrderHowToCall;
(function (OrderHowToCall) {
    OrderHowToCall[OrderHowToCall["CALL"] = 0] = "CALL";
    OrderHowToCall[OrderHowToCall["DELEGATE_CALL"] = 1] = "DELEGATE_CALL";
})(OrderHowToCall = exports.OrderHowToCall || (exports.OrderHowToCall = {}));
var OrderSaleKind;
(function (OrderSaleKind) {
    OrderSaleKind[OrderSaleKind["FIXED_PRICE"] = 0] = "FIXED_PRICE";
    OrderSaleKind[OrderSaleKind["DUTCH_AUCTION"] = 1] = "DUTCH_AUCTION";
})(OrderSaleKind = exports.OrderSaleKind || (exports.OrderSaleKind = {}));
var OrderSide;
(function (OrderSide) {
    OrderSide[OrderSide["BUY"] = 0] = "BUY";
    OrderSide[OrderSide["SELL"] = 1] = "SELL";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
//# sourceMappingURL=types.js.map