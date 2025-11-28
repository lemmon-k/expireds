'use client'

export const uploadAvatar = async (supabase, avatar, image) => {
  try {
    const fileExt = image.name.split(".").pop();
    const filePath = `public/${Date.now()}.${fileExt}`;

    // upload new avatar image
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, image);

    //catch error
    if (error) throw new Error("no-avatar");

    // remove old avatar image
    const removePath = avatar.split("/avatars/")[1];
    await supabase.storage.from("avatars").remove([removePath]);

    // fetch avatar url
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.log("Error: /upload-avatar", error);
    return false;
  }
};
