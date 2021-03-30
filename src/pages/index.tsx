import Head from "next/head";
import dynamic from "next/dynamic";
const DynamicComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});
import styles from "../../styles/Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rinse Orders Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <DynamicComponentWithNoSSR />
      </div>
      <footer>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
          integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
          crossOrigin=""
        ></script>
      </footer>
    </div>
  );
}

export default Home;
