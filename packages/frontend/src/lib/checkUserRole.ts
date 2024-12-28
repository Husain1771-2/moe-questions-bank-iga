import invokeApig from "./callAPI";

export async function checkUserRoleFormDB(email: string) {
    let body = { email: email };
    
  //@ts-ignore
     const response = await invokeApig({
       path: "/checkUserRole",
       method: "POST",
       body: body,
     });
    
    return response;
}
