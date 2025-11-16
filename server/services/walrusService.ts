/**
 * REAL Walrus Service for Decentralized Storage
 * 
 * This service uploads CV files to Walrus testnet using HTTP API.
 * Documentation: https://docs.wal.app/usage/web-api.html
 */

const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space";
const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";

interface WalrusUploadResult {
  contentId: string;
  storageUrl: string;
}

interface WalrusApiResponse {
  newlyCreated?: {
    blobObject: {
      id: string;
      blobId: string;
    };
  };
  alreadyCertified?: {
    blobId: string;
  };
}

/**
 * Uploads a CV file to Walrus testnet storage
 * 
 * @param fileBuffer - The CV file buffer
 * @param fileName - Original filename
 * @returns Promise with contentId and storageUrl
 */
export async function uploadCVToWalrus(
  fileBuffer: Buffer,
  fileName: string
): Promise<WalrusUploadResult> {
  try {
    console.log(`[WALRUS] Uploading ${fileName} to Walrus testnet...`);

    // Upload to Walrus testnet with deletable=true and 5 epochs
    const response = await fetch(`${WALRUS_PUBLISHER}/v1/blobs?deletable=true&epochs=5`, {
      method: "PUT",
      body: fileBuffer,
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Walrus upload failed: ${response.status} - ${errorText}`);
    }

    const result: WalrusApiResponse = await response.json();
    
    // Extract blob ID from response
    const blobId = result.newlyCreated?.blobObject.blobId || result.alreadyCertified?.blobId;
    
    if (!blobId) {
      throw new Error("No blob ID returned from Walrus");
    }

    const contentId = blobId;
    const storageUrl = `${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`;

    console.log(`[WALRUS] ✅ Successfully uploaded to Walrus!`);
    console.log(`[WALRUS] Blob ID: ${blobId}`);
    console.log(`[WALRUS] Storage URL: ${storageUrl}`);

    return {
      contentId,
      storageUrl,
    };
  } catch (error) {
    console.error("[WALRUS] Upload error:", error);
    throw new Error(`Failed to upload to Walrus: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Retrieves a file from Walrus storage by blob ID
 * 
 * @param contentId - The Walrus blob ID
 * @returns Promise with file buffer
 */
export async function retrieveFromWalrus(contentId: string): Promise<Buffer | null> {
  try {
    console.log(`[WALRUS] Retrieving content from Walrus: ${contentId}`);
    
    const response = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${contentId}`);
    
    if (!response.ok) {
      console.error(`[WALRUS] Retrieval failed: ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("[WALRUS] Retrieval error:", error);
    return null;
  }
}
