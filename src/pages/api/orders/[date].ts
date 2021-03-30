/**
 * Orders data type
 * @typedef {object} CustomerOrders
 *
 * @property {string} first_name.required - The customer first name
 * @property {string} last_name.required - The customer last name
 * @property {string} lat.required - The customer location in latitude
 * @property {string} lon.required - customer location in logitude
 * @property {string} time_assigned.required - order assigning time
 */

/**
 * Customers return data
 * @typedef {object} successResponse
 * @property {integer} code.required 200 - success code to return 200
 * @property {CustomerOrders} data - data
 */

/**
 * Customers order failed to return
 * @typedef {object} failedResponse
 * @property {integer} code.required 400 - error code to return error http codes
 * @property {string} message - success message
 */

import path from "path";
import { formatDate, readCSV } from "utils/helpers";

import { CustomerOrder } from "../../../@types/orders";

/**
 * GET /api/orders/:date
 * @summary This returns list of orders and its geometry, if given @param date will return orders on that date
 * @param {string} date.query.required - specific date to get orders from
 * @return {CustomerOrders} 200 - success response - application/json
 * @return {failedResponse} 400 - Bad request response
 * @tags Customer Orders
 */
export default async (req: any, res, next) => {
  try {
    const { date } = req.query;

    const path_url = "./src/pages/api/data/order.csv";

    const csvPath = path.resolve(path_url);

    const data = (await readCSV(csvPath).then((data: any) => {
      if (Array.isArray(data)) {
        /**
         * sort the orders by their time assigned in miliseconds
         */
        const sorted = data.sort((a, b) => {
          const atimeInMiliSeconds = new Date(a.time_assigned).getTime();
          const btimeInMiliSeconds = new Date(b.time_assigned).getTime();

          return atimeInMiliSeconds > btimeInMiliSeconds ? -1 : 1;
        });

        if (date && date !== "all")
          return sorted.filter((o) =>
            date ? formatDate(o.time_assigned) === formatDate(date) : date
          );

        return sorted;
      }
    })) as CustomerOrder[];

    res.status(200).json({ data });
    return;
  } catch (error) {
    console.log(error);
    return Promise.reject(new Error("Error occurred"));
  }
};
