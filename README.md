# myJazzRecordsApp

**<span style="text-decoration:underline;">myJazzRecordsApp</span>**

This is a database crud app build by Nishanth Dass and Christopher Irwin at Oregon State University. The project is hosted on Heroku. Link: https://myjazzy.herokuapp.com/

### Project Outline

Although “jazz” was once synonymous with popular music, today it is more of a niche musical interest. Since other forms of music have many more fans and listeners than jazz, many commercial opportunities are targeted toward genres with broader appeal. Our database design will allow for a better integration of jazz listeners with _desirable_ commerce opportunities (e.g. merchandise, concert performances, albums, artist biographies, etc.). 

Our database design is created with the goal of aggregating user data related to individual listeners’ collections to better understand and leverage trends across listeners’ ratings in the database. In the real-world, this type of information could then be used for marketing/commerce purposes. For example, listeners who have Bill Frisell’s Valentine in their collection and have assigned that performance a high rating could be informed that he appears on the new Charles Lloyd album Trios: Chapel album. Listeners in New Mexico who rank saxophone players highly can be informed that Charles Lloyd has a new album and is coming to Santa Fe soon.

In the real world, we envision the database working much like the website discogs.com or wikipedia, where the information is user-generated. Jazz listeners would be motivated to do so because they are aware of how hard it is to categorize their collections based on the instrumentalists they like the most. This is due to jazz musicians having such long careers and it being a huge genre that encompasses many eras & genres. Adding to the difficulty, an album that prominently features an important performance by a jazz musician may not be made under that musician’s name (e.g., Miles Davis’s performance on Cannonball Adderley’s Somethin’ Else album). In a real-world use-case, our  database  would help listeners understand their musical preferences on a more granular level without having to engage in exhaustive Jazz history research by allowing an individual user to implement CRUD operations for Albums, Musicians and Collections which includes key identifiers such as album name, musician name and collection names One listener can be allocated a single collection after which a rating can be assigned to an album and its musicians. The collection is intended to act as a reference to the albums that have been rated by a listener. 

In our database design, when a rating is given to an Album that rating will in turn be passed to the Musicians by way of a Performances entity that is in a 3-way composite relationship with Musicians, Albums, and a Performance_Ratings entity. For example, Earl Hines  and Louis Armstrong have been featured on records together from the 1920’s till the 1960’s. A listener may enjoy Earl and Louis' work in “Volume IV”  and “Vol III”, thus giving each album a rating of 5/5. This rating will be applied to Louis Armstrong, Earl Hines, and every other instrumentalist on those albums with a rating of 5/5 per album, thus Earl and Louis would each have a total of 10 points(5 points from each album). But the collector may dislike the vocals of Velma Middleton who only sang alongside Louis and Earl on the album “Satchmo at Pasadena” and this album is given a rating of 2/5,  thus Velma, Earl and Louis would each be given 2 points. Our database would allow for the summing of the ratings assigned to an album and its musicians. Summing the ratings would result in Louis having a total 12 points from three records, Earl a total of 12 points from three records and leaving Velma Middleton with only 2 points from one record. This rating system will help the listeners categorize albums by the instrumentalists featured and help the listeners avoid instrumentalists they don't like. 

The entity relationship put in place will make it possible to Identify the rating of the Album and the Musicians who performed on it. The Listener entity has a 1:1 relationship with Collections entity which will allow for each listener to have a reference to all the albums they have rated in the collection. The ability to assign a rating to an album chosen by the listener is dueto the rating attribute that exists in Performances_Ratings entity. Because Collections entity shares a 1:M relationship with Performances_Ratings, it becomes possible for a collection to have many ratings. To reduce the number of duplicates in the database it is essential for the Albums entity and Musicians entity to have independence from the ratings held in Performances_Ratings. To allow for many listeners to add the same album to their collection and have their own rating for said album, our group utilized a 3-way composite entity called Performances that forms a connection for Albums, Musicians and Performance_Ratings.

A database user would be inserting 100s of records and the collection will span at least 10 decades of jazz. Instrumentalists on each record will range from soloist’s, duos and trios to big bands. Again, individual users of our database in the real world would be able to perform CRUD operations on a master table of albums. This table will grow via user entries and could conceivably grow into the thousands or tens of thousands of records. This data can then be parsed by the database managers in many interesting ways to leverage listeners' geographic location and individual musical tastes.


### Database Outline

**Listeners:** records the details of listeners who want to utilize the jazz record catalog



* listener_id: int, PK, not NULL, unique, auto_increment
* name: varchar, not NULL, unique
* email: varchar, not NULL, unique
* Relationship: A 1:1 relationship between listeners and collections with the collections_collection_id as a FK inside of users. There is one user per collection and it is optional to have a collection.

**Collections:** holds the automatically generated collection_id, stores the name of the most popular artist in the collection based on the accumulation of points and provides the total number of Albums stored in the Collections table



* collection_id: int, PK, not NULL, unique, auto_increment
* name: varchar, not NULL
* Relationship: A 1:1 relationship between users and collections with the collections_collection_id as a FK inside of users
* Relationship: A 1:M relationship between Collections and Performance_Ratings with the collections_collection_id as a FK inside of Performance_Ratings. 

**Performance_Ratings**: This is an intersection table for Collections and Performances. It will also have an attribute called rating which will hold the value of the rating of a particular album.



* performance_rating_id:  int, PK, not NULL, unique, auto_increment
* collections_collection_id: int, not NULL
* performances_albums_album_id: int, not NULL
* rating: TINYINT
* Relationship: A 1:M relationship between Collections and Performance_Ratings with the collections_collection_id as a FK inside of Performance_Ratings. One collection can have many ratings.
* Relationship: A 1:M relationship between Performances and Performance_Ratings with performances_albums_album_id referenced as FK for Performances. One Performance can have many ratings.
* Relationship: Facilitates a M:M relationship between Collections and Performances with the collections_collection_id attribute referenced as a FK for Collections and performances_albums_album_id referenced as FK for Performances

**Performances**: This is an Intersection table between Albums and Musicians. It is a 3-way composite entity for Albums, Musicians and Performance_Ratings



* performance_id:  int, PK, not NULL, unique, auto_increment
* musicians_musician_id: int, PK, not NULL
* albums_album_id: int, PK, not NULL
* Relationship: Facilitates a M:M relationship between Albums and Musicians with the albums_album_id  and musicians_musician_id referenced as FKs inside of Performances table(intersection table). Many albums make up a musician's discography. ON DELETE CASCADE is used.
* Relationship: A 1:M relationship between Performances and Performance_Ratings with performances_albums_album_id referenced as FK for Performances. One Performance can have many ratings. ON DELETE CASCADE is used.

**Albums:**  records the details of albums to be held in a user’s collection



* album_id:  int, PK, not NULL, unique, auto_increment
* name: varchar, not NULL
* recording_year: YEAR, not NULL
* release_year: YEAR, 
* genres_genre_id: int
* bandleader_id: int
* Relationship: A 1:M relationship with Genres with genres_genre_id referenced as a FK in Albums. Many albums can have one Genre
* A M:M relationship exists between Albums and Musicians with  Performances as an intersection table. albums_album_id  is referenced as FKs inside of the Performances table(intersection table). Many albums make up a musician's discography
* A 1:M relationship between Albums and Musiances where bandleader_id is a FK in Albums and is referencing the musicians id from Musicians table. ON DELETE SET NULL is used.

**Musicians:**  records the details of musicians associated with albums that are held in a user’s collection



* musician_id:  int, PK, not NULL, unique, auto_increment
* first_name: varchar, not NULL
* last_name: varchar, not NULL
* instrument: varchar, not NULL
* Relationship: A M:M relationship between albums and musicians with the musicians_musician_id as a FK inside of Performances table(intersection table). Many musicians can play on many albums.
* A 1:M relationship between Albums and Musiances where bandleader_id is a FK in Albums and is referencing the musicians id from Musicians table

**Genres:**  holds the different genres [of jazz] that can be assigned to an album in a 1:M relationship



* genre_id:  int, PK, not NULL, unique, auto_increment
* genre_name: varchar, not NULL
* A 1:M relationship between Albums and Genres where genres_genre_id is a FK in Albums and is referencing the genre_id from the Genres table


### ERD

![erd](https://user-images.githubusercontent.com/19554568/185455588-ac77374f-5217-40b2-a1b4-a593c9052249.png)




### Schema



<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")



### Sample Data

We normalized our design to meet 1NF, 2NF, and 3NF using each entity represented as a table in a Google Doc. Looking at the Albums entity and the Musicians entity, for example, helped us to see that there was a redundancy that would lead to CRUD anomalies:


<table>
  <tr>
   <td>ALBUMS
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>album_id
   </td>
   <td>name
   </td>
   <td>recording_year
   </td>
   <td>release_year
   </td>
   <td>bandleader
   </td>
   <td>genre
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>FK from GENRE
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td>Kind of Blue
   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td>Miles Davis
   </td>
   <td><p style="text-align: right">
2</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td>Somethin' Else
   </td>
   <td><p style="text-align: right">
1958</p>

   </td>
   <td><p style="text-align: right">
1958</p>

   </td>
   <td>Cannonball Adderley
   </td>
   <td><p style="text-align: right">
1</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td>Portrait In Jazz
   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td><p style="text-align: right">
1960</p>

   </td>
   <td>Bill Evans
   </td>
   <td><p style="text-align: right">
1</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
4</p>

   </td>
   <td>Paraiso
   </td>
   <td><p style="text-align: right">
1978</p>

   </td>
   <td><p style="text-align: right">
1978</p>

   </td>
   <td>Haruomi Hosono
   </td>
   <td><p style="text-align: right">
3</p>

   </td>
  </tr>
</table>



<table>
  <tr>
   <td>MUSICIANS
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>musician_id
   </td>
   <td>first_name
   </td>
   <td>last_name
   </td>
   <td>instrument
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td>Miles
   </td>
   <td>Davis
   </td>
   <td>Trumpet
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td>Art
   </td>
   <td>Blakey
   </td>
   <td>Drums
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td>Bill
   </td>
   <td>Evans
   </td>
   <td>Piano
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
4</p>

   </td>
   <td>Haruomi
   </td>
   <td>Hosono
   </td>
   <td>Guitar
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
5</p>

   </td>
   <td>Cannonball
   </td>
   <td>Adderley
   </td>
   <td>Saxophone
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
6</p>

   </td>
   <td>Kamasi
   </td>
   <td>Washington
   </td>
   <td>Saxophone
   </td>
  </tr>
</table>


In the Albums entity, the bandleader field would have (in the best case) duplicate information as some of the attributes in the Musicians entity. In some cases (e.g., when Cannonball Adderley’s last name was misspelled on the cover of Kind of Blue as Cannonball Adderly) this data would not only be redundant, but it would also fail to connect a bandleader with their entire discography. Using the sample data helped us to make the decision to have a 1:1 relationship between Albums and Musicians to have the musician name as a foreign key in Albums. Our amended Albums entity looks like this:


<table>
  <tr>
   <td>ALBUMS
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>album_id
   </td>
   <td>name
   </td>
   <td>recording_year
   </td>
   <td>release_year
   </td>
   <td>bandleader
   </td>
   <td>genre
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>FK from MUSICIANS
   </td>
   <td>FK from GENRE
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td>Kind of Blue
   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td>Somethin' Else
   </td>
   <td><p style="text-align: right">
1958</p>

   </td>
   <td><p style="text-align: right">
1958</p>

   </td>
   <td><p style="text-align: right">
5</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td>Portrait In Jazz
   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td><p style="text-align: right">
1960</p>

   </td>
   <td><p style="text-align: right">
3</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
4</p>

   </td>
   <td>Paraiso
   </td>
   <td><p style="text-align: right">
1978</p>

   </td>
   <td><p style="text-align: right">
1978</p>

   </td>
   <td><p style="text-align: right">
4</p>

   </td>
   <td><p style="text-align: right">
3</p>

   </td>
  </tr>
</table>


Our final set of entities has no transitive dependencies and we believe each element is fully decomposed. 


<table>
  <tr>
   <td>MUSICIANS
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>musician_id
   </td>
   <td>first_name
   </td>
   <td>last_name
   </td>
   <td>instrument
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td>Miles
   </td>
   <td>Davis
   </td>
   <td>Trumpet
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td>Art
   </td>
   <td>Blakey
   </td>
   <td>Drums
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td>Bill
   </td>
   <td>Evans
   </td>
   <td>Piano
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
4</p>

   </td>
   <td>Haruomi
   </td>
   <td>Hosono
   </td>
   <td>Guitar
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
5</p>

   </td>
   <td>Cannonball
   </td>
   <td>Adderley
   </td>
   <td>Saxophone
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
6</p>

   </td>
   <td>Kamasi
   </td>
   <td>Washington
   </td>
   <td>Saxophone
   </td>
  </tr>
</table>



<table>
  <tr>
   <td>ALBUMS
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>album_id
   </td>
   <td>name
   </td>
   <td>recording_year
   </td>
   <td>release_year
   </td>
   <td>bandleader
   </td>
   <td>genre
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>FK from MUSICIANS
   </td>
   <td>FK from GENRE
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td>Kind of Blue
   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td>Somethin' Else
   </td>
   <td><p style="text-align: right">
1958</p>

   </td>
   <td><p style="text-align: right">
1958</p>

   </td>
   <td><p style="text-align: right">
5</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td>Portrait In Jazz
   </td>
   <td><p style="text-align: right">
1959</p>

   </td>
   <td><p style="text-align: right">
1960</p>

   </td>
   <td><p style="text-align: right">
3</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
4</p>

   </td>
   <td>Paraiso
   </td>
   <td><p style="text-align: right">
1978</p>

   </td>
   <td><p style="text-align: right">
1978</p>

   </td>
   <td><p style="text-align: right">
4</p>

   </td>
   <td><p style="text-align: right">
3</p>

   </td>
  </tr>
</table>



<table>
  <tr>
   <td>PERFORMANCES
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>performance_id
   </td>
   <td>musician_id
   </td>
   <td>album_id
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>FK from MUSICIANS
   </td>
   <td>FK from ALBUMS
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
4</p>

   </td>
   <td><p style="text-align: right">
3</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
5</p>

   </td>
   <td><p style="text-align: right">
4</p>

   </td>
   <td><p style="text-align: right">
4</p>

   </td>
  </tr>
</table>



<table>
  <tr>
   <td>PERFORMANCE_RATINGS
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>rating_id
   </td>
   <td>collection_id
   </td>
   <td>album_id
   </td>
   <td>rating
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>FK from COLLECTIONS
   </td>
   <td>FK from ALBUMS
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
5</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
   <td><p style="text-align: right">
4</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
   <td><p style="text-align: right">
5</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
4</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
4</p>

   </td>
   <td><p style="text-align: right">
3</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
5</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
   <td><p style="text-align: right">
4</p>

   </td>
   <td><p style="text-align: right">
5</p>

   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
6</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
  </tr>
</table>



<table>
  <tr>
   <td>COLLECTIONS
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>collection_id
   </td>
   <td>name
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td>Beth Bags' Bag of Tracks
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td>Loni's Library
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td>Tinnitus Tunes
   </td>
  </tr>
</table>



<table>
  <tr>
   <td>LISTENERS
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>listener_id
   </td>
   <td>collection_id
   </td>
   <td>name
   </td>
   <td>email
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>FK from COLLECTIONS
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td><p style="text-align: right">
1</p>

   </td>
   <td>Beth Bagley
   </td>
   <td>bagley.beth@gmail.com
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td><p style="text-align: right">
2</p>

   </td>
   <td>Loni McCarron
   </td>
   <td>LMcCar@servicepartners.net
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td><p style="text-align: right">
3</p>

   </td>
   <td>James Battat
   </td>
   <td>jbattat@wesleyan.edu
   </td>
  </tr>
</table>



<table>
  <tr>
   <td>GENRES
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>name
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
1</p>

   </td>
   <td>Hard Bop
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
2</p>

   </td>
   <td>Modal
   </td>
  </tr>
  <tr>
   <td><p style="text-align: right">
3</p>

   </td>
   <td>Fusion
   </td>
  </tr>
</table>



### Screen Captures of UI Pages 


#### Display Collections



<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image3.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image3.png "image_tooltip")



#### Insert Collection



<p id="gdcalert4" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image4.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert5">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image4.png "image_tooltip")




<p id="gdcalert5" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image5.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert6">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image5.png "image_tooltip")



#### Search Collections



<p id="gdcalert6" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image6.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert7">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image6.png "image_tooltip")




<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image7.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image7.png "image_tooltip")



#### Update Collection



<p id="gdcalert8" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image8.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert9">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image8.png "image_tooltip")




<p id="gdcalert9" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image9.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert10">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image9.png "image_tooltip")



#### Delete Collection (click on Delete button to the right of the collection)



<p id="gdcalert10" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image10.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert11">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image10.png "image_tooltip")



#### Display Listeners



<p id="gdcalert11" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image11.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert12">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image11.png "image_tooltip")



#### Insert Listener



<p id="gdcalert12" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image12.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert13">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image12.png "image_tooltip")




<p id="gdcalert13" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image13.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert14">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image13.png "image_tooltip")



#### Edit Listener



<p id="gdcalert14" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image14.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert15">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image14.png "image_tooltip")




<p id="gdcalert15" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image15.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert16">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image15.png "image_tooltip")



#### Delete Listener



<p id="gdcalert16" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image16.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert17">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image16.png "image_tooltip")




<p id="gdcalert17" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image17.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert18">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image17.png "image_tooltip")



#### Display Albums



<p id="gdcalert18" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image18.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert19">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image18.png "image_tooltip")



#### Insert Album



<p id="gdcalert19" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image19.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert20">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image19.png "image_tooltip")




<p id="gdcalert20" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image20.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert21">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image20.png "image_tooltip")



#### Edit Album - NULL Bandleader



<p id="gdcalert21" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image21.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert22">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image21.png "image_tooltip")




<p id="gdcalert22" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image22.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert23">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image22.png "image_tooltip")



#### Delete Album



<p id="gdcalert23" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image23.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert24">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image23.png "image_tooltip")




<p id="gdcalert24" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image24.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert25">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image24.png "image_tooltip")



#### Display Musicians



<p id="gdcalert25" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image25.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert26">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image25.png "image_tooltip")



#### Insert Musician



<p id="gdcalert26" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image26.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert27">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image26.png "image_tooltip")




<p id="gdcalert27" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image27.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert28">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image27.png "image_tooltip")



#### Edit Musician



<p id="gdcalert28" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image28.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert29">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image28.png "image_tooltip")




<p id="gdcalert29" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image29.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert30">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image29.png "image_tooltip")



#### Delete Musician (deleting musician_id 14)



<p id="gdcalert30" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image30.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert31">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image30.png "image_tooltip")




<p id="gdcalert31" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image31.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert32">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image31.png "image_tooltip")



#### Display Genres



<p id="gdcalert32" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image32.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert33">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image32.png "image_tooltip")



#### Insert Genre



<p id="gdcalert33" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image33.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert34">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image33.png "image_tooltip")




<p id="gdcalert34" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image34.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert35">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image34.png "image_tooltip")



#### Edit Genre



<p id="gdcalert35" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image35.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert36">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image35.png "image_tooltip")




<p id="gdcalert36" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image36.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert37">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image36.png "image_tooltip")



#### Delete Genre



<p id="gdcalert37" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image37.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert38">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image37.png "image_tooltip")




<p id="gdcalert38" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image38.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert39">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image38.png "image_tooltip")



#### Display Performances



<p id="gdcalert39" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image39.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert40">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image39.png "image_tooltip")



#### Insert Performance



<p id="gdcalert40" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image40.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert41">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image40.png "image_tooltip")




<p id="gdcalert41" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image41.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert42">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image41.png "image_tooltip")



#### Delete Performance



<p id="gdcalert42" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image42.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert43">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image42.png "image_tooltip")




<p id="gdcalert43" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image43.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert44">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image43.png "image_tooltip")



#### Display Performance Ratings



<p id="gdcalert44" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image44.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert45">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image44.png "image_tooltip")



#### Insert Performance Rating



<p id="gdcalert45" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image45.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert46">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image45.png "image_tooltip")




<p id="gdcalert46" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image46.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert47">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image46.png "image_tooltip")



#### Edit Performance Rating



<p id="gdcalert47" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image47.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert48">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image47.png "image_tooltip")




<p id="gdcalert48" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image48.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert49">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image48.png "image_tooltip")



#### Delete Performance Rating



<p id="gdcalert49" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image49.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert50">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image49.png "image_tooltip")




<p id="gdcalert50" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image50.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert51">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image50.png "image_tooltip")

