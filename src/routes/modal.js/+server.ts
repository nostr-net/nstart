// Move the file to: src/routes/modal.js/+server.ts

import { NstartModal } from '../../../modal-package/src/modal';
import type { RequestHandler } from '@sveltejs/kit';

// Generate the modal code
const modalCode = `
// Modal implementation
// (assigned to a const: the bundler may emit the class as an anonymous
// class expression, whose toString() is "class { ... }" with no name)
const NstartModal = ${NstartModal.toString()};

// Expose to window
if (typeof window !== 'undefined') {
  window.NstartModal = NstartModal;
}
`;

export const GET: RequestHandler = async () => {
  return new Response(modalCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
};