import { ChangeEvent, useEffect, useState } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";
import axios from "axios";

const Map = dynamic(() => import("../components/LeafletMap"), { ssr: false });

const Home = () => {
  const [routes, setRoutes] = useState([]);
  const [errRoutes, setErrRoutes] = useState<string | null>(null);
  const [selection, setSelection] = useState("");

  useEffect(() => {
    axios("/api/routes")
      .then((res) => {
        setRoutes(res.data.routes);
        setSelection(res.data.routes[0]);
      })
      .catch((err) => setErrRoutes("error loading routes"));
  }, []);

  const selectionChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelection(e.target.value);
  };

  return (
    <div id="app">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </Head>
      <Map routeId={selection} />
      <div id="controller">
        Routes:
        <select disabled={!!errRoutes} value={selection} onChange={selectionChangeHandler}>
          {routes.map((item, idx) => (
            <option key={idx}>{item}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Home;
