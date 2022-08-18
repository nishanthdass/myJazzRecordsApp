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

![schema](https://user-images.githubusercontent.com/19554568/185456201-27ecb31c-116d-46e7-bff0-81b203952fdf.png)



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


![displaycol](https://user-images.githubusercontent.com/19554568/185456316-59ccf330-41f0-49b2-b7fe-186fbfcd0dfb.png)



#### Insert Collection

![insertcol](https://user-images.githubusercontent.com/19554568/185456359-df5d2a7a-67f0-48b3-9e07-7d96fe4dfe42.png)

![insertcol2](https://user-images.githubusercontent.com/19554568/185456376-c78735e4-f735-474d-9516-e2eb8dd9e071.png)




#### Search Collections


![searchCol](https://user-images.githubusercontent.com/19554568/185459810-7ca3eefd-07c0-4e64-9233-63a6caccb9c6.png)

![searchCol2](https://user-images.githubusercontent.com/19554568/185459836-d036f3d8-5b2c-467a-9f32-a8e0013ec46e.png)




#### Update Collection


![updateCol](https://user-images.githubusercontent.com/19554568/185459878-67921e0b-b48e-4e1e-971c-54213bdcffd9.png)


![updateCol2](https://user-images.githubusercontent.com/19554568/185459895-f69012e6-045b-4302-9547-c00ccfb2c861.png)



#### Delete Collection (click on Delete button to the right of the collection)

![deleteCol](https://user-images.githubusercontent.com/19554568/185459913-2b759e66-9a72-49f6-810a-77f7979b48cc.png)




#### Display Listeners


![displayList](https://user-images.githubusercontent.com/19554568/185459951-aef3b309-bff2-4d98-80ea-befc698197d2.png)



#### Insert Listener

![insertList](https://user-images.githubusercontent.com/19554568/185459994-40e2f47c-dba5-4083-8479-5f18825bf746.png)



![insertList2](https://user-images.githubusercontent.com/19554568/185460005-9ae4cd0c-78d9-4c75-a7d3-37df5dbd9c1f.png)


#### Edit Listener

![editList](https://user-images.githubusercontent.com/19554568/185460037-c7c59df2-60a9-49a6-b697-80c7a3b0a007.png)


![editList2](https://user-images.githubusercontent.com/19554568/185460059-6005d048-ba98-4f05-80d8-d8c457ff1d81.png)



#### Delete Listener

![deleteList](https://user-images.githubusercontent.com/19554568/185460099-e8b07819-fd39-4d76-9dfc-f303fe57ceaa.png)



![deleteList2](https://user-images.githubusercontent.com/19554568/185460120-80846943-d8b2-4173-b7e7-973d0d0f18a5.png)



#### Display Albums


![displayAlb](https://user-images.githubusercontent.com/19554568/185460177-266da123-100a-4e73-8a34-90cb9062bb50.png)




#### Insert Album


![insertAlb](https://user-images.githubusercontent.com/19554568/185460208-a3d638d4-a902-4c48-93e1-ab33841754b0.png)


![insertAlb2](https://user-images.githubusercontent.com/19554568/185460227-11d71d0d-16aa-41f9-9abd-c0f497ea1fb0.png)




#### Edit Album - NULL Bandleader


![editAlbum](https://user-images.githubusercontent.com/19554568/185460289-7a79dec7-4dad-41c9-82a8-d9d432d1f677.png)


![editAlbum2](https://user-images.githubusercontent.com/19554568/185460325-3c942abe-57e4-48a3-a670-42eaf58ab7d5.png)



#### Delete Album

![deleteAlb](https://user-images.githubusercontent.com/19554568/185460341-5ff5b291-7025-45a4-95a8-bebf217c9e10.png)


![deleteAlb2](https://user-images.githubusercontent.com/19554568/185460372-3c9641ce-bec3-4ab0-bd46-d4c4508c8cd2.png)



#### Display Musicians

![displayMusc](https://user-images.githubusercontent.com/19554568/185461315-3af10b6b-fae3-4695-805a-347ccbc4a70a.png)





#### Insert Musician



![insertMusc](https://user-images.githubusercontent.com/19554568/185461338-54b20cf2-7e67-4991-a12e-b36932eb753e.png)


![insertMusc2](https://user-images.githubusercontent.com/19554568/185461364-dec83cfa-089b-4215-845b-f349517f20bd.png)


#### Edit Musician


![EditMusc](https://user-images.githubusercontent.com/19554568/185461391-f834410d-4687-4070-858b-18f38a5e6497.png)

![editMusc2](https://user-images.githubusercontent.com/19554568/185461400-55035865-582e-42f9-8311-c9be7810b020.png)



#### Delete Musician (deleting musician_id 14)


![deleteMusc](https://user-images.githubusercontent.com/19554568/185461418-8709b96c-d381-49a9-9752-2d504f908e36.png)

![deleteMusc2](https://user-images.githubusercontent.com/19554568/185461428-8803cbf8-23c4-4570-85cf-5824353ea85b.png)


#### Display Genres

![displayGenre](https://user-images.githubusercontent.com/19554568/185461456-ef2c9a0e-ed2b-4076-b0a5-204066608181.png)



#### Insert Genre

![insertGenres](https://user-images.githubusercontent.com/19554568/185461480-10811b4e-b1e4-474e-b960-9e969858ce6e.png)

![insertGenres2](https://user-images.githubusercontent.com/19554568/185461485-c0a93a01-927e-4629-b16a-18fe229913da.png)


#### Edit Genre


![editGenres](https://user-images.githubusercontent.com/19554568/185461502-8bd23724-bfc7-4989-a498-6e3cd221acd5.png)

![editGenres2](https://user-images.githubusercontent.com/19554568/185461515-44c44d86-05f2-4113-b89d-68de5b64a1a9.png)



#### Delete Genre

![delteGenres](https://user-images.githubusercontent.com/19554568/185461551-2b054d42-ef37-492e-9594-4aca5767fd5b.png)


![delteGenres2](https://user-images.githubusercontent.com/19554568/185461557-34cbbf6b-d0ad-4e43-b9eb-1ea9992859d1.png)


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

