import React, {useState, useEffect} from "react";
import {APP_NAME, APP_SLOGAN} from "../../App";
import styles from "./Loading.module.scss";

const Loading: React.FC = (loading: boolean) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (loading.isLoaded == true) {
      setTimeout(() => setIsLoaded(loading.isLoaded), 1000);
    }
  }, [loading]);

  useEffect(() => {
    if (isLoaded === true) {
      setTimeout(() => setHide(true), 1500)
    }
  }, [isLoaded])

  return (!hide &&
      <div
          className={`${styles.loadingContainer} ${isLoaded ? styles.fadeOut : ""}`}
      >
          <div className={styles.loadingAppLogoContainer}>
              <object type="image/svg+xml" data="/logo.svg" className={styles.loadingLogo}/>
          </div>
          <div className={styles.loadingTextContainer}>
              <div className={styles.loadingAppName}>{APP_NAME}</div>
              <div className={styles.loadingAppSlogan}>{APP_SLOGAN}</div>
          </div>
      </div>
  );
};

export default Loading;
