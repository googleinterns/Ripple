import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

@WebServlet("/upload")
public class Upload extends HttpServlet {
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse res)
        throws ServletException, IOException {
        System.out.println("Success: called doPost() in Upload.java");
        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
        List<BlobKey> blobKeys = blobs.get("file");

        if (blobKeys == null || blobKeys.isEmpty()) {
            System.out.println("Failure: blobkey is null or empty");
            res.sendRedirect("/");
        } else {
            System.out.println("Success: redirected to Serve.java");
            res.sendRedirect("/accountsettings.html?blob-key=" + blobKeys.get(0).getKeyString());
        }
    }
}