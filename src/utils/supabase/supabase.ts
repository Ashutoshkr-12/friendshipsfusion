import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use placeholders
// In a real app, these would be set in your environment
const supabaseUrl =  process.env.NEXT_PUBLIC_SUPABASE_URL! 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!




export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
  
);

export const ensureStorageBucket = async (bucketName: string) => {
  try {
    // Check if the bucket exists
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      await supabase.storage.createBucket(bucketName, {
        public: true, // Make the bucket public
      });
      console.log(`Created storage bucket: ${bucketName}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error ensuring storage bucket ${bucketName}:`, error);
    return false;
  }
};

