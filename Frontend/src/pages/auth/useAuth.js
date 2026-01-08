export function isAuthenticated(){
    return localStorage.getItem("auth") == "true";
}

export function login(){
    localStorage.setItem("auth","true");
}

export function logout(){
    localStorage.setItem("auth","false")
}