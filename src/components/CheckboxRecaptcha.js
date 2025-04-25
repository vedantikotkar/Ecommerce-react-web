// import React, { useState } from "react";

// const CheckboxRecaptcha = () => {
//   const [verified, setVerified] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [captchaChecked, setCaptchaChecked] = useState(false);

//   // Mock reCAPTCHA verification
//   const handleCaptchaCheck = () => {
//     setCaptchaChecked(!captchaChecked);
//     if (!captchaChecked) {
//       // Simulate verification delay
//       setTimeout(() => {
//         setVerified(true);
//       }, 800);
//     } else {
//       setVerified(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (verified && name && email) {
//       setSubmitted(true);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
//         {!submitted ? (
//           <>
//             <div className="bg-indigo-600 py-6 px-8">
//               <h2 className="text-2xl font-bold text-white text-center">Secure Verification</h2>
//               <p className="text-indigo-200 text-center mt-1">Please complete the form below</p>
//             </div>
//             <div className="p-8">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name
//                   </label>
//                   <input
//                     id="name"
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
//                     placeholder="Enter your name"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                     Email Address
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
//                     placeholder="Enter your email"
//                     required
//                   />
//                 </div>
                
//                 {/* Mock reCAPTCHA UI */}
//                 <div className="flex justify-center mt-6">
//                   <div className="border border-gray-300 rounded shadow-sm p-3 w-full max-w-xs">
//                     <div className="flex items-center mb-3">
//                       <div 
//                         className={`w-6 h-6 border rounded mr-3 flex items-center justify-center cursor-pointer transition-colors ${captchaChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
//                         onClick={handleCaptchaCheck}
//                       >
//                         {captchaChecked && (
//                           <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                           </svg>
//                         )}
//                       </div>
//                       <span className="text-sm text-gray-700">I'm not a robot</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-2">
//                           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//                           </svg>
//                         </div>
//                         <span className="text-xs text-gray-500">reCAPTCHA</span>
//                       </div>
//                       <div className="text-xs text-gray-400">Privacy - Terms</div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <button
//                   type="submit"
//                   disabled={!verified || !name || !email}
//                   className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 
//                     ${
//                       verified && name && email
//                         ? "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
//                         : "bg-gray-400 cursor-not-allowed"
//                     }`}
//                 >
//                   {verified ? "Submit" : "Please Complete Verification"}
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           <div className="p-8 text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
//               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mt-4">Submission Successful!</h2>
//             <p className="text-gray-600 mt-2">Thank you for verifying your identity, {name}.</p>
//             <button
//               onClick={() => {
//                 setSubmitted(false);
//                 setName("");
//                 setEmail("");
//                 setVerified(false);
//                 setCaptchaChecked(false);
//               }}
//               className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//             >
//               Submit Another Response
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CheckboxRecaptcha;

import React, { useState, useEffect } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = "6LeCaQIrAAAAAGa05ZepGUY413r7Y3cDcNu_Y-Y7";
const BACKEND_URL = "http://localhost:4000/api/verify-recaptcha"; // Update if needed

const RecaptchaForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const generateToken = async () => {
      if (executeRecaptcha) {
        const recaptchaToken = await executeRecaptcha("submit");
        setToken(recaptchaToken);
      }
    };
    generateToken();
  }, [executeRecaptcha]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setMessage("reCAPTCHA not ready. Please try again.");
      return;
    }
    
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error verifying reCAPTCHA");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Google reCAPTCHA v3</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input 
            type="text" 
            name="username" 
            placeholder="Enter your name" 
            required 
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

const App = () => (
  <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
    <RecaptchaForm />
  </GoogleReCaptchaProvider>
);

export default App;
