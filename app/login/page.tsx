"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { HardHat } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Registration Fields
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Site Manager");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const supabase = createClient();

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  // Sign up handler
  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Please enter both email and password to create an account.");
      return;
    }

    if (isSignUp && (!fullName || !company)) {
      setError("Please fill in your name and company details.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          company_name: company,
          phone: phone,
          avatar_url: `https://i.pravatar.cc/150?u=${email}`
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Account created successfully! If email confirmations are enabled in your Supabase dashboard, please check your inbox. Otherwise, you can now sign in.");
      setIsSignUp(false); // Switch back to login after success
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full bg-[#ffffff] rounded-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-8">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-[#182232] rounded-2xl flex items-center justify-center shadow-xl rotate-3">
              <HardHat className="w-10 h-10 text-[#feda5a]" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-[#182232]">Sitesync</h1>
            <p className="text-gray-500 font-sans text-sm tracking-wide bg-[#feda5a] px-3 py-1 rounded-full font-bold">ENTERPRISE OS</p>
          </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#182232] mb-1 font-sans">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f0f3ff] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans transition-all"
              placeholder="manager@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#182232] mb-1 font-sans">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f0f3ff] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans transition-all"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
               <div>
                <label className="block text-sm font-semibold text-[#182232] mb-1 font-sans">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#f0f3ff] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans transition-all"
                  placeholder="Rahul Sharma"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#182232] mb-1 font-sans">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#f0f3ff] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans transition-all appearance-none"
                  >
                    <option>Site Manager</option>
                    <option>Supervisor</option>
                    <option>Contractor</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#182232] mb-1 font-sans">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f0f3ff] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#182232] mb-1 font-sans">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#f0f3ff] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-b-2 focus:border-[#182232] font-sans transition-all"
                  placeholder="KBT Construction"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-[#ffdad6] text-[#93000a] text-sm rounded-md font-sans">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-[#88f9b0]/20 text-[#002813] text-sm rounded-md font-sans border border-[#40b472]">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-6">
            {!isSignUp ? (
              <>
                <Button 
                  type="submit" 
                  variant="default" 
                  className="w-full h-12 bg-[#715c00] hover:bg-[#5a4a00] font-heading font-bold rounded-xl shadow-lg shadow-[#715c00]/20"
                  disabled={loading}
                >
                  Sign In
                </Button>
                <button 
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-sm font-bold text-[#182232] hover:underline mt-2"
                >
                  Don't have an account? Create one
                </button>
              </>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="default" 
                  className="w-full h-12 bg-[#182232] hover:bg-[#2d3748] font-heading font-bold rounded-xl shadow-lg"
                  disabled={loading}
                  onClick={handleSignUp}
                >
                  Create Account
                </Button>
                <button 
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-sm font-bold text-[#182232] hover:underline mt-2"
                >
                  Already have an account? Sign In
                </button>
              </>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-gray-500 font-sans mt-8">
          Protected by role-based access control.
        </p>
      </div>
    </div>
  );
}
