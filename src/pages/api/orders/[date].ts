import path from "path";
import { formatDate, readCSV } from "utils/helpers";

import { CustomerOrder } from "../../../@types/orders";

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
