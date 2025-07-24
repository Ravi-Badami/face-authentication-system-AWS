import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return toast.error('Failed to capture image.');

    setLoading(true);
    const loginToast = toast.loading('Verifying your face...');

    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Login successful!', { id: loginToast });
        navigate('/dashboard', { replace: true }); // ✅ Prevent back to login
      } else {
        toast.error(data.error || 'Login failed.', { id: loginToast });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred.', { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Login with Your Face</h2>

        <div className="rounded-lg overflow-hidden border border-gray-300 shadow-md">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-auto object-cover"
          />
        </div>

        <button
          onClick={handleLogin}
          className={`w-full px-6 py-2 rounded-xl text-white transition duration-200 shadow-md flex items-center justify-center ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </div>
    </div>
  );
}
