/**
 * Alternative PDF variants with different Google Fonts
 * Use these as reference or swap them into the main resume-pdf.tsx
 */

import { Font } from "@react-pdf/renderer";

// Option 1: Source Sans Pro (Clean and Professional)
export const registerSourceSansPro = () => {
  Font.register({
    family: "Source Sans Pro",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/sourcesanspro/v21/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7lujVj9w.woff",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/sourcesanspro/v21/6xK1dSBYKcSV-LCoeQqfX1RYOo3qN67lqDY.woff",
        fontWeight: 600,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/sourcesanspro/v21/6xK1dSBYKcSV-LCoeQqfX1RYOo3qPK7lqDY.woff",
        fontWeight: 700,
        fontStyle: "normal",
      },
    ],
  });
};

// Option 2: Poppins (Modern and Friendly)
export const registerPoppins = () => {
  Font.register({
    family: "Poppins",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff",
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1JlFd2JQEk.woff",
        fontWeight: 600,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff",
        fontWeight: 700,
        fontStyle: "normal",
      },
    ],
  });
};

// Option 3: Lato (Elegant and Readable)
export const registerLato = () => {
  Font.register({
    family: "Lato",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXiWtFCc.woff",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh7USSiWtFCbQ7kE.woff",
        fontWeight: 700,
        fontStyle: "normal",
      },
    ],
  });
};

// Option 4: Open Sans (Google's Most Popular)
export const registerOpenSans = () => {
  Font.register({
    family: "Open Sans",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/opensans/v35/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.woff",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/opensans/v35/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4nY1M2xLER.woff",
        fontWeight: 600,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/opensans/v35/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsiH0C4nY1M2xLER.woff",
        fontWeight: 700,
        fontStyle: "normal",
      },
    ],
  });
};

// Option 5: Roboto (Material Design)
export const registerRoboto = () => {
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff",
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff",
        fontWeight: 700,
        fontStyle: "normal",
      },
    ],
  });
};

// Example usage - just change the import and font family in your styles:
/*
// In resume-pdf.tsx, replace the current font registration with:
import { registerSourceSansPro } from './resume-pdf-variants';

// Call this before your component
registerSourceSansPro();

// Then update your styles:
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Source Sans Pro',  // Change this line
    // ... rest of styles
  }
});
*/
