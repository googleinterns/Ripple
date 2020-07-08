// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * When the fetch() function requests the /blobstore-upload-url URL, the content of the response is
 * the URL that allows a user to upload a file to Blobstore. If this sounds confusing, try running a
 * dev server and navigating to /blobstore-upload-url to see the Blobstore URL.
 */
// @WebServlet("/blobstore-upload-url")
// public class BlobstoreUploadUrlServlet extends HttpServlet {

//   @Override
//   public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
//     System.out.println("called doGet() in BlobstoreUploadUrlServlet");
//     // Store the blob and add blob info to datastore
//     BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
//     String uploadUrl = blobstoreService.createUploadUrl("/my-form-handler");
//     System.out.println("uploadUrl: " + uploadUrl);
//     // Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
//     // List<BlobKey> blobKeys = blobs.get("file");
// // 
//     // if (blobKeys == null || blobKeys.isEmpty()) {
//         // response.sendRedirect("/");
//     // }
//     // String blobKey = blobKeys.get(0).getKeyString();
//     // System.out.println("blobKey: " + blobKey);
//     // Return string as a json object!!
//     Gson gson = new Gson();
//     response.setContentType("application/json;");
//     response.getWriter().println(gson.toJson(uploadUrl));
//   }
// }

@WebServlet("/blobstore-upload-url")
public class BlobstoreUploadUrlServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Store the blob and add blob info to datastoer
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
    String uploadUrl = blobstoreService.createUploadUrl("/my-form-handler");
    System.out.println("uplaodUrl: " + uploadUrl);
    response.setContentType("text/html");
    response.getWriter().println(uploadUrl);
  }
}