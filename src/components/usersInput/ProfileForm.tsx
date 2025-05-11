'use client'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {   redirect, useRouter } from 'next/navigation'; // Import useRouter
import {userdata} from '@/hooks/userdata'; // Import userdata function
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserCircle, Mail,MessageCircleHeart , MapPin,MarsStroke, Calendar, BookText, Smile, Camera, ImagePlus,Image as Images,BookUser  } from 'lucide-react';
import Image from 'next/image';
import { ensureStorageBucket, supabase } from '@/utils/supabase/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
 age: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 18, { 
  message: 'You must be at least 18 years old.'}), 
  email: z.string().email({ message: 'Please enter a valid email.' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }).max(300, { message: 'Bio cannot exceed 300 characters.' }),
  interests: z.string().min(2, { message: 'Please add at least one interest.' }),
  gender: z.string(),
  interested_in: z.string(),
  occupation:z.string(),
   avatar: (typeof FileList !== 'undefined' ? z.instanceof(FileList) : z.any()).optional()
      .refine((files) => !files?.length || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 6MB`)
      .refine((files) => !files?.length || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png and .webp formats are supported"),

    photo1: (typeof FileList !== 'undefined' ? z.instanceof(FileList) : z.any()).optional()
      .refine((files) => !files?.length || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 6MB`)
      .refine((files) => !files?.length || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png and .webp formats are supported"),

    photo2: (typeof FileList !== 'undefined' ? z.instanceof(FileList) : z.any()).optional()
      .refine((files) => !files?.length || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 6MB`)
      .refine((files) => !files?.length || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png and .webp formats are supported"),
  }); 


const ProfileInputForm = () => {
   const [avatarPreview, setAvatarPreview] = useState<string | null | File >(null);
    const [photo1Preview, setPhoto1Preview] = useState<File | null | string>(null);
    const [photo2Preview, setPhoto2Preview] = useState<File | null | string>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [loader,setLoader]= useState(false);
  const router = useRouter()
  const[userid, setUserid] = useState<string | undefined>();
  type ProfileFormValue = z.infer<typeof formSchema>;

  //fetching users email 
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoader(true);
        const userData = await userdata(); // Fetch the email and ID
        if (!userData) {
          console.error('No session found. Redirecting to login.');// Redirect to login page
          return; // Handle the absence of a session
        }
        setUserEmail(userData.email); // Set the email
        setUserid(userData.userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUserData();
    setLoader(false);
  }, [router]);

  if (loader){
    <div className='w-full h-screen flex items-center justify-center'><span className='loader'></span></div>
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      
      name: '',
      age: '',
      email: userEmail, // Initially empty
      location: '',
      bio: '',
      interests: '',
      gender:'',
      interested_in: '',
      occupation:'',
      avatar: undefined,
      photo1: undefined,
      photo2: undefined,
    },
  });
  
//setting value of email
  useEffect(() => {
    if (userEmail) {
      form.setValue('email', userEmail); 
      //console.log(userEmail);
    }
  }, [userEmail, form]);


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

  const AVATAR_BUCKET = 'avatar';
  const POSTS_BUCKET = 'post-images';
  const onSubmit = async (formData: ProfileFormValue) => {
    
    try {
      setLoading(true);
      const interestsArray = formData.interests.split(',').map(i => i.trim());
      const avatarFile = formData.avatar?.[0] || null;
      const photoFiles: File[] = [];
      if (formData.photo1?.[0]) photoFiles.push(formData.photo1[0]);
      if (formData.photo2?.[0]) photoFiles.push(formData.photo2[0]);
      

       // Ensure storage buckets exist
    await ensureStorageBucket(AVATAR_BUCKET);
    await ensureStorageBucket(POSTS_BUCKET);
      // Upload avatar if provided
      let avatarUrl;
      if (avatarFile) {
        const avatarFileName = `avatar_${userid}_${Date.now()}_${avatarFile.name}`;
        const {  error: avatarError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .upload(avatarFileName, avatarFile, {
            upsert: true,
            cacheControl: '3600',
            contentType: avatarFile.type
          });
  
        if (avatarError) {
          console.error('Error uploading avatar:', avatarError);
          return { success: false, error: `Avatar upload failed: ${avatarError.message}` };
        }
  
       
        const { data: avatarUrlData } = supabase.storage
          .from(AVATAR_BUCKET)
          .getPublicUrl(avatarFileName);
  
        avatarUrl = avatarUrlData.publicUrl.trim();
      }
  
      // Upload photos if provided
      const photoUrls: string[] = [];
      if (photoFiles && photoFiles.length > 0) {
        for (const photoFile of photoFiles) {
          const photoFileName = `photo_${userid}_${Date.now()}_${photoFile.name}`;
          const { error: photoError } = await supabase.storage
            .from(POSTS_BUCKET)
            .upload(photoFileName, photoFile, {
              upsert: true,
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
  
          photoUrls.push(photoUrlData.publicUrl.trim());
        }
      }
  
      const data = {
        user_id: userid,
        name: formData.name,
        age: parseInt(formData.age), // Ensure age is sent as a number
        email: userEmail,
        gender: formData.gender,
        interested_in: formData.interested_in,
        location: formData.location,
        bio: formData.bio,
        interests: interestsArray,
        occupation:formData.occupation,
        avatar: avatarUrl,
        photo_url: photoUrls.length > 0 ? photoUrls : null,
      };


    const { error: insertError } = await supabase.from("profiles").insert(data);
    if (insertError) {
      alert("Error saving user data!");
    } 
    setLoading(false);
  } catch(error){
    console.log(error)
    }finally{
      const { data , error: profileError} = await supabase.from('profiles').select('id').eq('user_id',userid).single();
      if(profileError){
        toast.error(profileError.message)
      }
      const profileid = data?.id
      redirect(`/home/${profileid}`);
    }
  }



  // if (!userEmail) {
  //   return <div className='w-full h-screen flex items-center justify-center'><p className=''>Loading...</p></div>; // Show a loading state while fetching the user data
  // }

  return (
    <div>
      <div className='border-b p-2'>
       <Image
                  src="/friendshipfusionlogo.png"
                  alt="friendship/fusion"
                  width={250}
                  height={35}
                  priority
                />
       </div>
    <div>
    <Card className="max-w-2xl mt-6 mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Profile</CardTitle>
        <CardDescription>
          Tell us about yourself to set up your profile and find better matches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method='POST' className="space-y-6">
  {/* Avatar upload */}
  <FormField
                control={form.control}
                name="avatar"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="w-full flex items-center gap-2 mb-2">
                      <UserCircle className="h-4 w-4" />
                      Profile Picture
                    </FormLabel>
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="w-24 h-24 border-2 border-primary/20">
                        {avatarPreview ? (
                          <AvatarImage
                            src={avatarPreview}
                            alt="Avatar preview"
                          />
                        ) : (
                          <AvatarFallback className="bg-primary/5">
                            <Camera className="h-8 w-8 text-primary/40" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="avatar-upload"
                            onChange={(e) => {
                              handleImageChange(e, setAvatarPreview);
                              onChange(e.target.files);
                            }}
                            {...fieldProps}
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Upload Avatar
                          </label>
                        </div>
                      </FormControl>
                    </div>
                    <FormDescription className="text-center mt-2">
                      This will be your main profile picture.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {/* name field*/}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how you&apos;ll appear to others.
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
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" readOnly placeholder="Your email" {...field} />
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
                      <option className='bg-zinc-700 text-slate-800' value='prefer not to say' >Select your gender</option>
                      <option className='bg-zinc-700 text-white' value='Male'>Male</option>
                      <option className='bg-zinc-700 text-white' value='Female'>Female</option>
                      <option className='bg-zinc-700 text-white' value='Trans'>Trans</option>
                      <option className='bg-zinc-700 text-white' value='Gay'>Gay</option>
                      <option className='bg-zinc-700 text-white' value='Lesbian'>Lesbian</option>
                      <option className='bg-zinc-700 text-white' value='Bisexual'>Bi-sexual</option>
                      <option className='bg-zinc-700 text-white' value='Other'>Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interested_in"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageCircleHeart  className="h-4 w-4" />
                    Interested in
                  </FormLabel>
                  <FormControl>
                    <select  id="gender" className='border py-1.5 bg-zinc-800 px-2 rounded-lg'{...field}>
                      <option className='bg-zinc-700 text-slate-600'value ='prefer not to say' >Select whom you are interested in</option>
                      <option className='bg-zinc-700 text-white' value='Male'>Male</option>
                      <option className='bg-zinc-700 text-white' value='Female'>Female</option>
                      <option className='bg-zinc-700 text-white' value='Everyone'>Everyone</option>
                    </select>
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
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
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
                    Write a short bio that describes your personality, hobbies, and what you&apos;re looking for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Smile className="h-4 w-4" />
                    Interests
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Music, Travel, Cooking, etc. (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add your interests, separated by commas.
                  </FormDescription>
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
               {/* Photos section */}
               <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Photos</h3>
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
                          <div className="relative w-full h-48 border-2 border-dashed border-primary/20 rounded-md overflow-hidden flex items-center justify-center bg-primary/5">
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
              
         
            <Button
                disabled={loading}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs ${
                  loading
                    ? "bg-gray-900 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                }`}
              >
                {loading ? "Saving your data..." : "Lets go"}
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

export default ProfileInputForm;