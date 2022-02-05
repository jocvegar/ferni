export default async function ({ store, redirect }) {
  const user = store.state.user;
  if (user) {
    // let the user see the page
  } else {
    // redirect to homepage
    redirect("/login");
  }
}
