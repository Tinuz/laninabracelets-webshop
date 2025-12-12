'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Settings, CheckCircle, AlertCircle, RefreshCw, LogOut, ExternalLink } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

interface OAuthStatus {
  authenticated: boolean;
  hasTokens: boolean;
  tokenValid: boolean;
  hasRefreshToken: boolean;
  userId?: string;
  scopes: string[];
  expiresAt?: number;
  updatedAt?: number;
}

export default function AdminOAuthPage() {
  const [status, setStatus] = useState<OAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/oauth/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch OAuth status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/oauth/status', { method: 'DELETE' });
      if (response.ok) {
        await fetchStatus();
      } else {
        throw new Error('Failed to logout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const startOAuth = () => {
    window.location.href = '/api/admin/oauth/start';
  };

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-stone-400 mb-4" />
            <p className="text-stone-600">Laden...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-8 h-8 text-stone-700" />
            <div>
              <h1 className="font-serif text-3xl text-stone-900">Admin Dashboard</h1>
              <p className="text-stone-600">Etsy Shop Integratie</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* OAuth Status */}
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl text-stone-900 mb-4">Verbindingsstatus</h2>
              
              <div className="space-y-4">
                {/* Authentication Status */}
                <div className="flex items-center justify-between p-4 border border-stone-200">
                  <div className="flex items-center gap-3">
                    {status?.authenticated ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-stone-900">
                        Etsy Shop Toegang
                      </p>
                      <p className="text-sm text-stone-600">
                        {status?.authenticated 
                          ? 'Verbonden en werkend' 
                          : 'Niet verbonden'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {status?.authenticated && (
                      <p className="text-xs text-stone-500">
                        User ID: {status.userId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Token Details */}
                {status?.hasTokens && (
                  <div className="p-4 bg-stone-50 space-y-2">
                    <h3 className="font-medium text-stone-900 text-sm">Token Informatie</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-stone-600">Token Status:</span>
                        <span className={`ml-2 ${status.tokenValid ? 'text-green-600' : 'text-orange-600'}`}>
                          {status.tokenValid ? 'Geldig' : 'Verlopen'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-600">Refresh Token:</span>
                        <span className={`ml-2 ${status.hasRefreshToken ? 'text-green-600' : 'text-red-600'}`}>
                          {status.hasRefreshToken ? 'Beschikbaar' : 'Niet beschikbaar'}
                        </span>
                      </div>
                      {status.expiresAt && (
                        <div className="col-span-2">
                          <span className="text-stone-600">Verloopt op:</span>
                          <span className="ml-2 text-stone-900">
                            {new Date(status.expiresAt).toLocaleString('nl-NL')}
                          </span>
                        </div>
                      )}
                      {status.scopes.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-stone-600">Toegangsrechten:</span>
                          <span className="ml-2 text-stone-900">
                            {status.scopes.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-stone-900">Acties</h2>
              
              {!status?.authenticated ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                    <h3 className="font-medium text-blue-900 mb-2">Eerst keer instellen</h3>
                    <p className="text-blue-800 text-sm mb-4">
                      Klik op de knop hieronder om je Etsy shop te verbinden. 
                      Je wordt doorgestuurd naar Etsy om toestemming te geven.
                    </p>
                    <Button onClick={startOAuth} className="inline-flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Verbind met Etsy Shop
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-stone-200">
                    <h3 className="font-medium text-stone-900 mb-2">Wat gebeurt er?</h3>
                    <ul className="text-sm text-stone-600 space-y-1">
                      <li>• Je wordt doorgestuurd naar Etsy.com</li>
                      <li>• Etsy vraagt om toestemming voor je shop data</li>
                      <li>• Na goedkeuring kom je terug naar deze site</li>
                      <li>• Je website kan dan automatisch producten ophalen</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border-l-4 border-green-400">
                    <h3 className="font-medium text-green-900 mb-2">✅ Alles is ingesteld!</h3>
                    <p className="text-green-800 text-sm">
                      Je website haalt nu automatisch producten op van je Etsy shop.
                      De verbinding wordt automatisch ververst wanneer nodig.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="secondary" 
                      onClick={fetchStatus}
                      disabled={loading}
                      className="inline-flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Status Vernieuwen
                    </Button>
                    
                    <Button 
                      onClick={handleLogout}
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <LogOut className="w-4 h-4" />
                      Verbinding Verbreken
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="pt-8 border-t border-stone-200">
              <Link 
                href="/" 
                className="text-stone-600 hover:text-stone-900 transition-colors inline-flex items-center gap-2"
              >
                ← Terug naar Website
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
