'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface NewsletterFormProps {
  className?: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm({ className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Vul je e-mailadres in.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail(''); // Clear the input
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Er ging iets mis. Probeer het later opnieuw.');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4 py-4"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-stone-700 text-center font-medium">{message}</p>
            <button
              onClick={resetForm}
              className="text-sm text-stone-500 hover:text-stone-700 underline"
            >
              Nog iemand inschrijven?
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') resetForm();
                }}
                placeholder="Jouw e-mailadres"
                disabled={status === 'loading'}
                className={`w-full px-6 py-4 border bg-white text-stone-900 placeholder-stone-400 focus:outline-none transition-colors font-light ${
                  status === 'error' 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-stone-300 focus:border-stone-900'
                }`}
                aria-label="E-mailadres voor nieuwsbrief"
              />
            </div>
            <Button 
              type="submit"
              disabled={status === 'loading'}
              className="sm:w-auto whitespace-nowrap px-8 py-4 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Bezig...
                </span>
              ) : (
                'Schrijf In'
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {status === 'error' && message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2 mt-4 text-red-600"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

