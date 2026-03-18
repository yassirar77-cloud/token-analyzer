const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

/**
 * Resolve a cover image value to a full URL.
 * Handles IPFS CID hashes (Qm... or bafy...), full URLs, and null/empty values.
 */
export function resolveIpfsCover(coverImage?: string | null): string {
  if (!coverImage) return '/placeholder-cover.png';

  // Already a full URL
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    return coverImage;
  }

  // IPFS CID hash — prepend gateway
  if (coverImage.startsWith('Qm') || coverImage.startsWith('bafy')) {
    return `${IPFS_GATEWAY}${coverImage}`;
  }

  // Relative path or other value — use gateway as prefix
  return `${IPFS_GATEWAY}${coverImage}`;
}
