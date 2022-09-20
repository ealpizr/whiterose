import Head from "next/head";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "styles/Home.module.css";
import IBotData from "types/IBotData";

const Home = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_URL;
  const [botData, setBotData] = useState<IBotData>();

  const toastOptions = {
    pauseOnHover: false,
    pauseOnFocusLoss: false,
  };

  const fetchConnect = () => {
    return new Promise<void>(async (resolve, reject) => {
      const response = await fetch(`${BASE_URL}/api/connect`);
      return response.status === 200 ? resolve() : reject();
    });
  };

  const fetchBotStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/status`);
      const body = await response.json();
      setBotData(body.status);
    } catch (error) {
      setBotData(undefined);
    }
  };

  const requestBotConnection = async () => {
    if (botData) {
      return toast.error("Bot is already connected", toastOptions);
    }
    toast.promise(
      fetchConnect(),
      {
        pending: "Creating bot...",
        success: "Bot connected successfully",
        error: "Something went wrong",
      },
      toastOptions
    );
  };

  useEffect(() => {
    fetchBotStatus();
    const updateInverval = setInterval(fetchBotStatus, 5000);
    return () => clearInterval(updateInverval);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Whiterose</title>
      </Head>
      <ToastContainer />

      <main className={styles.main}>
        <h1 className={styles.title}>Whiterose</h1>

        <p className={styles.description}>Created with ♥ by Freeware</p>

        <div className={styles.code}>
          {botData ? (
            <>
              <p>
                <b>Status: </b> ONLINE
              </p>
              <p>
                <b>UUID: </b>
                {botData.uuid}
              </p>
              <p>
                <b>Version: </b>
                {botData.version}
              </p>
              {botData.ping !== 0 && (
                <p>
                  <b>Ping: </b>
                  {botData.ping}
                </p>
              )}
            </>
          ) : (
            <p>
              <b>Status: </b> OFFLINE
            </p>
          )}
        </div>

        <div className={styles.grid}>
          <a className={styles.card} onClick={requestBotConnection}>
            <h2>Connect &rarr;</h2>
            <p>Initialize an instance of the bot and connect to the server</p>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
