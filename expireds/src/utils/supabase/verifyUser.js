"use server";

export const verifyUser = async (supabase) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    return false;
  }
};
