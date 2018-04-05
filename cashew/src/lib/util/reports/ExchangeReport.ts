import { Exchange, Order } from "../../empire/Exchange";
import { StringBuilder } from "../StringBuilder";

export class ExchangeReport {
    public static getHtml(exchange: Exchange): string {
        let sb = new StringBuilder();
        sb.appendLine("Supply Orders", "yellow");
        for (let key in exchange.supplyOrders)
            sb.appendLine(exchange.supplyOrders[key]);
        sb.appendLine();

        sb.appendLine("Demand Orders", "yellow");        
        for (let key in exchange.demandOrders)
            sb.appendLine(exchange.demandOrders[key]);
        sb.appendLine();

        sb.appendLine("Transactions", "yellow");
        for (let key in exchange.transactions)
            sb.appendLine(exchange.transactions[key]);
        sb.trim();
        return sb.toString();
    }

}
