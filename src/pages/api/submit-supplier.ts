import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Use environment variables for security)
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const POST = async ({ request }) => {
  try {
    const data = await request.formData();

    // 1. Collect Text Fields
    const businessName = data.get('businessName');
    const category = data.get('category');
    const pinNumber = data.get('pinNumber');
    const creditPeriod = data.get('creditPeriod');

    // 2. Collect Files from the form
    const taxCert = data.get('taxCert') as File;
    const cr12 = data.get('cr12') as File;
    const permit = data.get('permit') as File;

    // Helper function to handle the upload to Supabase Storage
    const uploadFile = async (file: File, folder: string) => {
      // Create a unique filename: company-time-filename
      const fileName = `${businessName?.toString().replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${file.name}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('supplier-docs')
        .upload(filePath, file);

      if (error) throw error;
      return data.path; // This returns the path to store in the DB
    };

    // 3. Execute Uploads (One by one)
    // We wrap this in a Try/Catch to handle any failed uploads
    const taxCertPath = await uploadFile(taxCert, 'tax_certs');
    const cr12Path = await uploadFile(cr12, 'cr12_docs');
    const permitPath = await uploadFile(permit, 'business_permits');

    // 4. Save Record to Database
    const { error: dbError } = await supabase
      .from('suppliers')
      .insert([{
        business_name: businessName,
        category: category,
        pin_number: pinNumber,
        credit_period: creditPeriod,
        tax_cert_url: taxCertPath,
        cr12_url: cr12Path,
        permit_url: permitPath,
        status: 'Pending Review' // Default status for new registrations
      }]);

    if (dbError) throw dbError;

    // 5. Success Redirect
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/thanks' }
    });

  } catch (error) {
    console.error('Submission Error:', error);
    // Redirect to an error page if anything fails
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/error' }
    });
  }
};