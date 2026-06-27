// app/not-found.js
"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { Home, ArrowLeft, Search, Package } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50/30 to-white flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-sky-100/40 border border-sky-100/40 p-8 md:p-12 text-center">
          
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-sky-100/50 to-blue-100/50 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <div className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                404
              </div>
              <div className="absolute -top-4 -right-4 animate-bounce">
                <Package className="w-12 h-12 text-sky-400/50" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Oops! Preorder Not Found
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto">
              The preorder you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/preorders">
              <Button
                className="bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all duration-300 rounded-full px-6 py-2.5 font-medium"
                startContent={<Home size={18} />}
              >
                Back to Preorders
              </Button>
            </Link>
            <Button
              onPress={() => window.history.back()}
              className="border border-gray-300 rounded-full px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              startContent={<ArrowLeft size={18} />}
            >
              Go Back
            </Button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-6 pt-6 border-t border-gray-200/60">
            <p className="text-sm text-gray-400 mb-2">
              <Search className="inline w-4 h-4 mr-1" />
              Need help finding something?
            </p>
            <Link
              href="/preorders"
              className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
            >
              Browse all preorders →
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-xs text-gray-400">
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 bg-sky-400 rounded-full" />
              Preorder Manager v2.0
              <span className="w-1 h-1 bg-sky-400 rounded-full" />
              Made with 💜
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}