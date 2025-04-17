
-- Update Storage RLS policies to fix upload issues

-- First, ensure bucket exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'ecard-images') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('ecard-images', 'ecard-images', true);
    END IF;
END
$$;

-- Create policy for uploads to the ecard-images bucket (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Anyone can upload to ecard-images'
    ) THEN
        CREATE POLICY "Anyone can upload to ecard-images"
        ON storage.objects
        FOR INSERT
        WITH CHECK (bucket_id = 'ecard-images');
    END IF;
END
$$;

-- Create policy for selecting from the ecard-images bucket (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Anyone can view objects in ecard-images'
    ) THEN
        CREATE POLICY "Anyone can view objects in ecard-images"
        ON storage.objects
        FOR SELECT
        USING (bucket_id = 'ecard-images');
    END IF;
END
$$;

-- Create policy for updating objects in the ecard-images bucket (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Anyone can update objects in ecard-images'
    ) THEN
        CREATE POLICY "Anyone can update objects in ecard-images"
        ON storage.objects
        FOR UPDATE
        USING (bucket_id = 'ecard-images');
    END IF;
END
$$;

-- Create policy for deleting objects in the ecard-images bucket (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Anyone can delete objects in ecard-images'
    ) THEN
        CREATE POLICY "Anyone can delete objects in ecard-images"
        ON storage.objects
        FOR DELETE
        USING (bucket_id = 'ecard-images');
    END IF;
END
$$;
