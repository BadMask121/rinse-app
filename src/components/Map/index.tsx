import React, { useEffect, useMemo } from "react";
import { DatePicker } from "@atlaskit/datetime-picker";
import { CustomerOrder } from "../../@types/orders";
import RinseMap from "./map";
import styles from "./style.module.css";
import { generate } from "short-id";

const Map = () => {
  const [orders, setOrders] = React.useState<CustomerOrder[]>([]);
  const [loading, setloading] = React.useState(false);

  useEffect(() => {
    fetchMapOrderLocations();
  }, []);

  useEffect(() => {
    const RINSE_AREA_VIEW_LAT = 37.7;
    const RINSE_AREA_VIEW_LONG = -122.4;

    const container = document.getElementById("map");
    if (container) {
      /**
       * create an instance of the map view
       */
      const map = new RinseMap("map", [
        RINSE_AREA_VIEW_LAT,
        RINSE_AREA_VIEW_LONG,
      ]);

      //  render to map
      if (Array.isArray(orders)) {
        orders.forEach((o) => {
          map.addLocation(
            [o.lat as number, o.lon as number],
            `<b>${o.first_name} ${o.last_name}</b>
              <br>
              <b>Order assigned date: ${new Date(
                o.time_assigned
              ).toLocaleDateString()} ${new Date(
              o.time_assigned
            ).toLocaleTimeString()}</b>
              `
          );
        });
      }

      return () => map.cleanup();
    }
    return () => null;
  }, [orders]);

  // render list
  const _renderList = useMemo(() => {
    return Array.isArray(orders)
      ? orders.map((o) => (
          <li key={generate()}>
            {o.first_name} {o.last_name}{" "}
            <span>
              Order assigned date:
              <b>
                {" "}
                {new Date(o.time_assigned).toLocaleDateString()}{" "}
                {new Date(o.time_assigned).toLocaleTimeString()}
              </b>
            </span>
          </li>
        ))
      : [];
  }, [orders]);

  async function fetchMapOrderLocations(date?: string) {
    setloading(true);
    return fetch(`/api/orders/${date || "all"}`)
      .then((result) => result.json())
      .then((result) => {
        const data = result.data;
        setOrders(data);
        setloading(false);
        return Promise.resolve(data);
      })
      .catch((err) => {
        console.log(err);
        setloading(false);
      });
  }

  return (
    <React.Fragment>
      <div id="map" className={styles.container} />
      <React.Fragment>
        <div className={styles.listContainer}>
          <div className={styles.datePicker}>
            <DatePicker
              dateFormat="DD/MM/YYYY"
              onChange={(val) => {
                fetchMapOrderLocations(val);
              }}
              hideIcon={true}
              defaultValue={"2021-03-26"}
            />
          </div>
          {loading ? (
            <p style={{ alignSelf: "center" }}>Loading...</p>
          ) : _renderList.length ? (
            <ul>{_renderList}</ul>
          ) : (
            <p style={{ alignSelf: "center" }}>No Orders Found</p>
          )}
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};

export default Map;
