"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Op = exports.DelegationType = exports.Intent = void 0;
var Intent;
(function (Intent) {
    Intent[Intent["SELL"] = 1] = "SELL";
    Intent[Intent["BUY"] = 3] = "BUY";
})(Intent = exports.Intent || (exports.Intent = {}));
var DelegationType;
(function (DelegationType) {
    DelegationType[DelegationType["ERC721"] = 1] = "ERC721";
    DelegationType[DelegationType["ERC1155"] = 2] = "ERC1155";
})(DelegationType = exports.DelegationType || (exports.DelegationType = {}));
var Op;
(function (Op) {
    Op[Op["INVALID"] = 0] = "INVALID";
    Op[Op["COMPLETE_SELL_OFFER"] = 1] = "COMPLETE_SELL_OFFER";
    Op[Op["COMPLETE_BUY_OFFER"] = 2] = "COMPLETE_BUY_OFFER";
    Op[Op["CANCEL_OFFER"] = 3] = "CANCEL_OFFER";
    Op[Op["BID"] = 4] = "BID";
    Op[Op["COMPLETE_AUCTION"] = 5] = "COMPLETE_AUCTION";
    Op[Op["REFUND_AUCTION"] = 6] = "REFUND_AUCTION";
    Op[Op["REFUND_AUCTION_STUCK_ITEM"] = 7] = "REFUND_AUCTION_STUCK_ITEM";
})(Op = exports.Op || (exports.Op = {}));
//# sourceMappingURL=types.js.map