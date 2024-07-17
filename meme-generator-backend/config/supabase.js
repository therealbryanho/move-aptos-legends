const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const uploadFileOnSupabase = async (fileBlob, uploadPathWithFileName) => {
    try {
        console.log("Uploading file on supabase...");

        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(
                uploadPathWithFileName,
                fileBlob
            );

        if (error) {
            throw error; // Throw error to be caught in the catch block
        }

        let fullPath = data?.fullPath; // Ensure data is not null and use 'path' instead of 'fullPath'
        if (!fullPath) {
            throw new Error("Upload failed, no path returned.");
        }

        const uploadedFileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${fullPath}`
        console.log("File uploaded at: ", uploadedFileUrl);
        return { status: 200, message: "Image generated", uploadedFileUrl };
    } catch (err) {
        console.error("uploadFileOnSupabase failed with error: ", err);
        return { status: 500, message: "Failed to generate image at the moment!", supabaseError: err, uploadedFileUrl: null };
    }
};

module.exports = { uploadFileOnSupabase }