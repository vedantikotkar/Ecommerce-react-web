// import React, { useEffect, useState } from "react";
// import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

// const RecaptchaV3Component = () => {
//   const { executeRecaptcha } = useGoogleReCaptcha();
//   const [token, setToken] = useState("");

//   useEffect(() => {
//     if (!executeRecaptcha) {
//       return;
//     }

//     const getToken = async () => {
//       const recaptchaToken = await executeRecaptcha("submit_form");
//       setToken(recaptchaToken);
//     };

//     getToken();
//   }, [executeRecaptcha]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       alert("reCAPTCHA failed. Try again.");
//       return;
//     }

//     const response = await fetch("http://localhost:4000/verify-recaptcha", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token }),
//     });

//     const result = await response.json();
//     if (result.success) {
//       alert(" reCAPTCHA Verified! Form submitted.");
//     } else {
//       alert(" reCAPTCHA Verification Failed!");
//     }
//   };

//   return (
//     <GoogleReCaptchaProvider reCaptchaKey="6Lc1h_8qAAAAAJ9TZbXB6zc4mDlZLW-HzzOAK1SC">
//       <form onSubmit={handleSubmit}>
//         <button type="submit">Submit</button>
//       </form>
//     </GoogleReCaptchaProvider>
//   );
// };

// export default RecaptchaV3Component;
