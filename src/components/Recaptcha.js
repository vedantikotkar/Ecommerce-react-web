// import React, { useRef, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";

// const InvisibleRecaptcha = () => {
//   const recaptchaRef = useRef(null);
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     recaptchaRef.current.execute();
//   };

//   const onReCAPTCHAChange = async (token) => {
//     console.log("CAPTCHA Token:", token);
//     if (token) {
//       setMessage("CAPTCHA Verified ✅");
//       // Send 'token' to your backend for verification
//     } else {
//       setMessage("CAPTCHA Failed ❌");
//     }
//   };

//   return (
//     <div>
//       <h2>Google reCAPTCHA v2 - Invisible</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Enter your name" required />
//         <br /><br />
//         <ReCAPTCHA
//           ref={recaptchaRef}
//           sitekey="6LcrvPwqAAAAALEDp7zLhuN-43yt2Pj9Il8ovgJ3"
//           size="invisible"
//           onChange={onReCAPTCHAChange}
//         />
//         <button type="submit">Submit</button>
//       </form>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default InvisibleRecaptcha;
