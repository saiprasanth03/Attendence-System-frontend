
// import React, { useEffect, useRef, useState } from "react";
// import { BrowserMultiFormatReader } from "@zxing/browser";
// import api from "../services/api";
// import Navbar from "../components/Navbar";

// export default function ScanQR() {
//   const videoRef = useRef(null);
//   const readerRef = useRef(null);

//   // 🔒 HARD LOCK (prevents double scan)
//   const hasScannedRef = useRef(false);

//   const [status, setStatus] = useState(null);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const reader = new BrowserMultiFormatReader();
//     readerRef.current = reader;

//     startScanner();

//     return () => {
//       stopScanner();
//     };
//   }, []);


//   const stopScanner = async () => {
//     try {
//       if (readerRef.current) {
//         await readerRef.current.stopContinuousDecode?.();
//         readerRef.current.reset();
//       }

//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject;
//         if (stream) {
//           stream.getTracks().forEach(track => {
//             track.stop();
//           });
//           videoRef.current.srcObject = null;
//         }
//       }
//     } catch (err) {
//       console.log("Stop error:", err);
//     }
//   };


//   const startScanner = async () => {
//     try {
//       hasScannedRef.current = false; // reset lock

//       const devices =
//         await BrowserMultiFormatReader.listVideoInputDevices();

//       if (!devices.length) {
//         setStatus("fail");
//         setMessage("No camera found");
//         return;
//       }

//       const deviceId = devices[0].deviceId;

//       readerRef.current.decodeFromVideoDevice(
//         deviceId,
//         videoRef.current,
//         async (result) => {
//           if (!result) return;

//           // 🔒 HARD STOP
//           if (hasScannedRef.current) return;
//           hasScannedRef.current = true;

//           stopScanner(); // force stop immediately

//           const qrToken = result.getText();

//           navigator.geolocation.getCurrentPosition(
//             async (position) => {
//               const latitude = position.coords.latitude;
//               const longitude = position.coords.longitude;

//               try {
//                 const res = await api.post("/attendance/mark", {
//                   qrToken,
//                   latitude,
//                   longitude,
//                 });

//                 setStatus("success");
//                 setMessage(
//                   res.data || "Attendance Marked Successfully!"
//                 );

//               } catch (err) {
//                 setStatus("fail");
//                 setMessage(
//                   err.response?.data || "Attendance Failed"
//                 );

//                 // Restart scanner after failure
//                 setTimeout(() => {
//                   setStatus(null);
//                   setMessage("");
//                   startScanner();
//                 }, 3000);
//               }
//             },
//             () => {
//               setStatus("fail");
//               setMessage("Location permission denied");

//               setTimeout(() => {
//                 setStatus(null);
//                 setMessage("");
//                 startScanner();
//               }, 3000);
//             }
//           );
//         }
//       );
//     } catch (err) {
//       console.log(err);
//       setStatus("fail");
//       setMessage("Camera permission denied");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />

//       <div className="max-w-2xl mx-auto p-6 text-center mt-[90px]">
//         <h1 className="text-3xl font-bold mb-6">Scan QR</h1>

//         {status !== "success" && (
//           <div className="relative mx-auto max-w-lg">
//             <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-blue-500">
//               <video
//                 ref={videoRef}
//                 className="w-full aspect-square object-cover"
//               />
//             </div>

//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//               <div className="w-72 h-72 border-4 border-green-400 rounded-xl"></div>
//             </div>
//           </div>
//         )}

//         {status === "success" && (
//           <div className="mt-6 text-2xl font-bold text-green-600">
//             🎉 {message}
//           </div>
//         )}

//         {status === "fail" && (
//           <div className="mt-6 text-2xl font-bold text-red-600">
//             ❌ {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function ScanQR() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  // 🔒 HARD LOCK (prevents double scan)
  const hasScannedRef = useRef(false);

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [facingMode, setFacingMode] = useState("environment"); // back camera default

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    startScanner();

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line
  }, [facingMode]); // restart when camera changes


  const stopScanner = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.stopContinuousDecode?.();
        readerRef.current.reset();
      }

      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    } catch (err) {
      console.log("Stop error:", err);
    }
  };


  const startScanner = async () => {
    try {
      hasScannedRef.current = false; // reset lock

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();

      if (!devices.length) {
        setStatus("fail");
        setMessage("No camera found");
        return;
      }

      // 🔥 SMART CAMERA SELECTION
      let selectedDevice;

      if (facingMode === "environment") {
        selectedDevice = devices.find(device =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear")
        );
      } else {
        selectedDevice = devices.find(device =>
          device.label.toLowerCase().includes("front")
        );
      }

      if (!selectedDevice) {
        selectedDevice = devices[0];
      }

      const deviceId = selectedDevice.deviceId;

      readerRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        async (result) => {
          if (!result) return;

          // 🔒 HARD STOP
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;

          stopScanner(); // force stop immediately

          const qrToken = result.getText();

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              try {
                const res = await api.post("/attendance/mark", {
                  qrToken,
                  latitude,
                  longitude,
                });

                setStatus("success");
                setMessage(
                  res.data || "Attendance Marked Successfully!"
                );

              } catch (err) {
                setStatus("fail");
                setMessage(
                  err.response?.data || "Attendance Failed"
                );

                // Restart scanner after failure
                setTimeout(() => {
                  setStatus(null);
                  setMessage("");
                  startScanner();
                }, 3000);
              }
            },
            () => {
              setStatus("fail");
              setMessage("Location permission denied");

              setTimeout(() => {
                setStatus(null);
                setMessage("");
                startScanner();
              }, 3000);
            }
          );
        }
      );
    } catch (err) {
      console.log(err);
      setStatus("fail");
      setMessage("Camera permission denied");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6 text-center mt-[70px]">
        <h1 className="text-3xl font-bold mb-6">Scan QR</h1>

        {status !== "success" && (
          <div className="relative mx-auto max-w-lg">
            <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-blue-500">
              <video
                ref={videoRef}
                className="w-full aspect-square object-cover"
                onDoubleClick={() => {
                  // 🔄 Double tap to switch camera
                  setFacingMode(prev =>
                    prev === "environment" ? "user" : "environment"
                  );
                }}
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 border-4 border-green-400 rounded-xl"></div>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="mt-6 text-2xl font-bold text-green-600">
            🎉 {message}
          </div>
        )}

        {status === "fail" && (
          <div className="mt-6 text-2xl font-bold text-red-600">
            ❌ {message}
          </div>
        )}

        {/* Optional small hint */}
        {status !== "success" && (
          <p className="mt-4 text-sm text-gray-500">
            Double tap screen to switch camera
          </p>
        )}
      </div>
    </div>
  );
}
