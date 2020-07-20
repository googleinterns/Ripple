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

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * When the fetch() function requests the /blobstore-upload-url URL, the content of the response is
 * the URL that allows a user to upload a file to Blobstore. If this sounds confusing, try running a
 * dev server and navigating to /blobstore-upload-url to see the Blobstore URL.
 */
@WebServlet("/blobstore-upload-url")
public class BlobstoreUploadUrlServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    // Store the blob and add blob info to datastore
    System.out.println("BlobstoreUploadUrlServlet called to create blobstore path");
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
    String fileId = getParameter(req, "file-id", "");
    String webUrl = getParameter(req, "web-url", "");
    String blobstoreUploadUrl = blobstoreService.createUploadUrl("/upload?file-id=" + fileId + "&web-url=" + webUrl);
    res.setContentType("text/html");
    res.getWriter().println(blobstoreUploadUrl);
  }

  private String getParameter(HttpServletRequest req, String name, String defaultValue) {
    String value = req.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }
}
