// Converts Firebase error codes and other errors into user-friendly messages

export const getErrorMessage = (error: any): string => {
  // Extract error code from various Firebase error formats
  let errorCode = error.code;
  
  // If no code but has message, try to extract code from message
  // Handles formats like "Error (auth/invalid-credential)"
  if (!errorCode && error.message) {
    const match = error.message.match(/\(([^)]+)\)/);
    if (match) {
      errorCode = match[1];
    }
  }
  
  // Handle Firebase Auth errors
  if (errorCode) {
    switch (errorCode) {
      // Authentication errors
      case 'auth/invalid-email':
        return 'Invalid email address. Please check and try again';
      case 'auth/user-disabled':
        return 'This account has been disabled. Contact support for help';
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/requires-recent-login':
        return 'Please log out and log in again to continue';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code. Please try again';
      case 'auth/invalid-verification-id':
        return 'Verification failed. Please start over';
      case 'auth/missing-verification-code':
        return 'Please enter the verification code';
      case 'auth/missing-verification-id':
        return 'Verification session expired. Please start over';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email';
      case 'auth/credential-already-in-use':
        return 'This credential is already linked to another account';
      case 'auth/timeout':
        return 'Request timed out. Please try again';
      case 'auth/missing-email':
        return 'Email address is required';
      case 'auth/invalid-password':
        return 'Invalid password. Password must be at least 6 characters';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled';

      // Firestore errors
      case 'permission-denied':
        return 'You do not have permission to perform this action';
      case 'not-found':
        return 'The requested resource was not found';
      case 'already-exists':
        return 'This resource already exists';
      case 'failed-precondition':
        return 'Operation cannot be completed at this time';
      case 'aborted':
        return 'Operation was cancelled. Please try again';
      case 'out-of-range':
        return 'Invalid input value';
      case 'unimplemented':
        return 'This feature is not yet available';
      case 'internal':
        return 'Internal error occurred. Please try again';
      case 'unavailable':
        return 'Service is temporarily unavailable';
      case 'data-loss':
        return 'Data error occurred. Please contact support';
      case 'unauthenticated':
        return 'You must be logged in to continue';
      case 'resource-exhausted':
        return 'Service quota exceeded. Please try again later';
      case 'cancelled':
        return 'Operation was cancelled';
      case 'invalid-argument':
        return 'Invalid input. Please check your data';
      case 'deadline-exceeded':
        return 'Request timed out. Please try again';

      // Storage errors
      case 'storage/unauthorized':
        return 'You do not have permission to access this file';
      case 'storage/canceled':
        return 'File upload was cancelled';
      case 'storage/unknown':
        return 'An unknown error occurred during file upload';
      case 'storage/object-not-found':
        return 'File not found';
      case 'storage/bucket-not-found':
        return 'Storage bucket not found';
      case 'storage/project-not-found':
        return 'Project configuration error';
      case 'storage/quota-exceeded':
        return 'Storage quota exceeded';
      case 'storage/unauthenticated':
        return 'You must be logged in to upload files';
      case 'storage/retry-limit-exceeded':
        return 'Upload failed. Please try again';
      case 'storage/invalid-checksum':
        return 'File was corrupted during upload';
      case 'storage/server-file-wrong-size':
        return 'File upload failed. Please try again';

      default:
        // Return a generic message for unknown codes
        return 'Something went wrong. Please try again';
    }
  }

  // Handle standard Error objects without codes
  // Avoid showing raw Firebase error messages
  if (error.message && !error.message.includes('Firebase') && !error.message.includes('Error (')) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again';
};

// Logs error details for debugging while showing user-friendly message
export const handleError = (error: any, context: string = ''): string => {
  // Log full error for debugging
  console.error(`Error in ${context}:`, error);
  
  // Return user-friendly message
  return getErrorMessage(error);
};
