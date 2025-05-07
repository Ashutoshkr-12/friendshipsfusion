'use client'
import React, {  useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {    useRouter } from 'next/navigation'; // Import useRouter 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserCircle, MapPin,MarsStroke, Calendar, BookText,  Camera, ImagePlus,Image as Images,BookUser, Ruler, Languages, HandPlatter,  CircleDollarSign  } from 'lucide-react';
import { ensureStorageBucket, supabase } from '@/utils/supabase/supabase';

import { toast } from 'sonner';
import { useUser } from '@/hooks/profileIdContext';

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 18, { message: 'You must be at least 18 years old.' }),
 height: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 100, { message: 'Add height in cm.' }),
 language: z.string(),
 weight: z.string(),
  hourly_rent: z.string(),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }).max(300, { message: 'Bio cannot exceed 300 characters.' }),
  services: z.string().min(2, { message: 'Please add at least one interest.' }),
  gender: z.string(),
  occupation:z.string(),
    photo1: z.instanceof(FileList).optional().refine(                 
      (files) => !files?.length || (files?.[0]?.size <= MAX_FILE_SIZE), 
      `Max file size is 6MB`
    ).refine(
      (files) => !files?.length || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
    photo2: z.instanceof(FileList).optional().refine(
      (files) => !files?.length || (files?.[0]?.size <= MAX_FILE_SIZE), 
      `Max file size is 6MB`
    ).refine(
      (files) => !files?.length || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});


const Rentalprofile = () => {
    const [photo1Preview, setPhoto1Preview] = useState<File | null | string>(null);
    const [photo2Preview, setPhoto2Preview] = useState<File | null | string>(null);
   const {profileId} = useUser();
   const router = useRouter();
  const [loading, setLoading] = useState(false);
 
  type ProfileFormValue = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {    
      name: '',
      age: '',
      location: '',
      bio: '',    
      services: '',
      gender:'', 
      occupation:'',
      
    },
  });
  

 


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setPreview: React.Dispatch<React.SetStateAction<string | null | File>>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    };

  const POSTS_BUCKET = 'rental-images';
  const onSubmit = async (formData: ProfileFormValue) => {
    
    try {
      setLoading(true);
      const interestsArray = formData.services.split(',').map(i => i.trim());
   
      const photoFiles: File[] = [];
      if (formData.photo1?.[0]) photoFiles.push(formData.photo1[0]);
      if (formData.photo2?.[0]) photoFiles.push(formData.photo2[0]);
      

       // Ensure storage buckets exist
    await ensureStorageBucket(POSTS_BUCKET);
      // Upload avatar if provided
   
  
      // Upload photos if provided
      const photoUrls: string[] = [];
      if (photoFiles && photoFiles.length > 0) {
        for (const photoFile of photoFiles) {
          const photoFileName = `photo_${profileId}_${Date.now()}_${photoFile.name}`;
          const { data: photoData, error: photoError } = await supabase.storage
            .from(POSTS_BUCKET)
            .upload(photoFileName, photoFile, {
              upsert: true,
              // Use authenticated user's ID for path
              cacheControl: '3600',
              contentType: photoFile.type
            });
  
          if (photoError) {
            console.error('Error uploading photo:', photoError);
            return { success: false, error: `Photo upload failed: ${photoError.message}` };
          }
  
          // Get the public URL for the photo
          const { data: photoUrlData } = supabase.storage
            .from(POSTS_BUCKET)
            .getPublicUrl(photoFileName);
  
          photoUrls.push(photoUrlData.publicUrl);
        }
      }
  
      const data = {
        profile_id: profileId,
        name: formData.name,
        age: parseInt(formData.age), // Ensure age is sent as a number
        height : parseInt(formData.height),
        weight: parseInt(formData.weight),
        gender: formData.gender,
       hourly_rent:parseInt(formData.hourly_rent),
        location: formData.location,
        language: formData.language,
        bio: formData.bio,
        services: interestsArray,
        occupation:formData.occupation,
        photo_url: photoUrls.length > 0 ? photoUrls : null,

      // Ensure this matches the expected format in the database
      };
    // Insert User Data
    const { error: insertError } = await supabase.from("rental_profiles").insert(data);

    if (insertError) {
      toast("Error saving user data!");
    } 
    router.push(`/rent-a-friend`)
    setLoading(false);
  } catch(error){
    console.log(error)
    }
  }



  // if (!userEmail) {
  //   return <div className='w-full h-screen flex items-center justify-center'><p className=''>Loading...</p></div>; // Show a loading state while fetching the user data
  // }

  return (
    <div>
    <div>
    <Card className="max-w-2xl mt-6 mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl border-b-2">Create Your Rental profile</CardTitle>
        <CardDescription>
          Tell us about yourself to set up your profile so, users can find interest in you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method='POST' className="space-y-6">

    {/* Photos section */}
    <div className="space-y-2">
                <h3 className="text-lg font-medium">Additional Photos </h3>
                <span className='text-[12px] tracking-tighter text-gray-400 '>Dont't worry about the size, your picture is visible in full size on your profile</span>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Photo 1 */}
                  <FormField
                    control={form.control}
                    name="photo1"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Images className="h-4 w-4" />
                          Photo 1
                        </FormLabel>
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative w-full h-72 border-2 border-dashed border-primary/20 rounded-md overflow-hidden flex items-center justify-center bg-primary/5">
                            {photo1Preview ? (
                              <img 
                              src={photo1Preview}
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImagePlus className="h-12 w-12 text-primary/40" />
                            )}
                          </div>
                          <FormControl>
                            <div className="flex items-center gap-2 w-full">
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="photo1-upload"
                                onChange={(e) => {
                                   handleImageChange(e, setPhoto1Preview );
                                   onChange(e.target.files);
                                }}
                                {...fieldProps}
                              />
                              <label 
                                htmlFor="photo1-upload"
                                className="cursor-pointer w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                              >
                                <Camera className="mr-2 h-4 w-4" />
                                Upload Photo
                              </label>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Photo 2 */}
                  <FormField
                    control={form.control}
                    name="photo2"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Images className="h-4 w-4" />
                          Photo 2
                        </FormLabel>
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative w-full h-48 border-2 border-dashed border-primary/20 rounded-md overflow-hidden flex items-center justify-center bg-primary/5">
                            {photo2Preview ? (
                              <img 
                              src={photo2Preview}
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImagePlus className="h-12 w-12 text-primary/40" />
                            )}
                          </div>
                          <FormControl>
                            <div className="flex items-center gap-2 w-full">
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="photo2-upload"
                                onChange={(e) => {
                                   handleImageChange(e, setPhoto2Preview);
                                  onChange(e.target.files);
                                }}
                                {...fieldProps}
                              />
                              <label 
                                htmlFor="photo2-upload"
                                className="cursor-pointer w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                              >
                                <Camera className="mr-2 h-4 w-4" />
                                Upload Photo
                              </label>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            {/* name field*/}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Enter your name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how you'll appear to others.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Age
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="18" placeholder="Your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            </div>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MarsStroke className="h-4 w-4" />
                    Gender
                  </FormLabel>
                  <FormControl>
                    <select
                      id="gender"
                      className='border py-1.5 bg-zinc-800 px-2 rounded-lg'
                      {...field}
                    >
                      <option className='bg-zinc-700 text-slate-800' >Select your gender</option>
                      <option className='bg-zinc-700 text-white' value='Male'>Male</option>
                      <option className='bg-zinc-700 text-white' value='Female'>Female</option>
                      <option className='bg-zinc-700 text-white' value='Trans'>Trans</option>
                      <option className='bg-zinc-700 text-white' value='Gay'>Gay</option>
                      <option className='bg-zinc-700 text-white' value='Lesbian'>Lesbian</option>
                      <option className='bg-zinc-700 text-white' value='Bisexual'>Bi-sexual</option>
                      <option className='bg-zinc-700 text-white' value='Other'>prefer not to say</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Height
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="In cm" type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Weight
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="In kgs" type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="City, state, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
             <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BookUser  className="h-4 w-4" />
                    Job Title or Profession
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="....." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Languages
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="English, hindi, etc ..." required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <HandPlatter className="h-4 w-4" />
                    Available For
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Travelling,Career guidence, Movie date etc.. (comma separated)" required {...field} />
                  </FormControl>
                  <FormDescription>
                    Add the services you are available for, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="hourly_rent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CircleDollarSign  className="h-4 w-4" />
                    Hourly Rent
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="In dollers" type='number' required {...field} />
                  </FormControl>
                  <FormDescription>
                    Add the services charge, choose a decent amount In US DOLLERS .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BookText className="h-4 w-4" />
                    About Me
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself..." 
                      className="resize-none h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Write a short bio that describes your personality, hobbies, and all.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
              
         
            <Button
                disabled={loading}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs ${
                  loading
                    ? "bg-gray-900 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                }`}
              >
                {loading ? "Creating your profile..." : "Create profile"}
              </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        You can edit your profile later from your account settings.
      </CardFooter>
    </Card>
    </div>
    <div>
    </div>
    </div>
  );
};

export default Rentalprofile;