# fam
find-a-masjid or fam, is a resource to display masajid throughout the United States. Users can register and submit their own local masajid, as not all masjids in the US are included initially. Only the author of the Masjid and the admin can change/delete Masijd information. Users can also comment and review different masajid.

---Index Page----
On the index page, all the masajid in the database are listed, with options to sort alphabetically or reverse alphabetically. MergeSort is used to implement both sorts. Additionally, there is basic search functionality that searches for masajid that have the query somewhere in their name. Additionally, the map displays the masajid on the page, with the bottom-most button on the map being able to find the user's geolocation and zoom in to it. This way, a user can zoom in or out to find masajid near them.

---Specific Masjid page----
On the page for a specific masjid, you are able to view the pictures of the masjid (these are initially stock images), and also leave a review, if you are logged in. A map is also displayed where clicking the map marker displays the street address of the masjid. The actual masjid information on the left lists the name, who submitted the masjid, the city and state, and also the average review. The user who submitted the masjid, along with the admin, will see an "Edit" and "Delete" button as well.

---Masjid Edit/New Form----
Both the Edit and form to create a new masjid are similar. Both require you to enter a name, address, zipcode, city, and state, with phone number, image, and description being optional. Both also require you to be logged in to access the form, with the Edit form allowing only the author and site admin to access it. The Edit form also allows you to upload additional pictures, as well as delete older pictures that may no longer be required.

---User Register Form----
The user registration form is very simple and only requires a username and password. Email is optional, as login only requires the username and password. The password is hashed and salted for additionaly security.
