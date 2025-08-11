package com.tcs.dhv;

import com.tcs.dhv.util.EmailConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.context.Context;
import java.util.HashMap;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class EmailTemplateTest {

    private TemplateEngine templateEngine;

    @BeforeEach
    void setup() {
        final var resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix(EmailConstants.RESOLVER_PREFIX);
        resolver.setSuffix(EmailConstants.RESOLVER_SUFFIX);
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding(EmailConstants.ENCODING);

        templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(resolver);
    }

    @Test
    void testAddressChangeEmail() {
        final var ctxVars = new HashMap<>();
        ctxVars.put("name", "testName");
        ctxVars.put("trackingCode", "HU10digitsand2letters");
        ctxVars.put("oldAddressLine1", "Test Road 69");
        ctxVars.put("oldAddressLine2", "2. emelet");
        ctxVars.put("oldAddressLine3", "Budapest 1234 Hungary");
        ctxVars.put("newAddressLine1", "Test Road 96");
        ctxVars.put("newAddressLine2", "3. emelet");
        ctxVars.put("newAddressLine3", "Budapest 4321 Hungary");
        ctxVars.put("reason", "Because testing");
        final var context = new Context();
        for(var key : ctxVars.keySet())
            context.setVariable((String)key, ctxVars.get(key));

        final var output = templateEngine.process("AddressChangeNotificationEmail.html", context);
        for(var key : ctxVars.keySet())
            assertTrue(output.contains((String)ctxVars.get(key)));
        assertTrue(output.contains("</html>"));
        assertTrue(output.contains("</body>"));
    }

    @Test
    void testDeliveryCompletionEmail() {
        final var ctxVars = new HashMap<>();
        ctxVars.put("trackingCode", "HU10digitsand2letters");
        ctxVars.put("name", "testName");
        ctxVars.put("trackingUrl", "www.test.org");
        final var context = new Context();
        for(var key : ctxVars.keySet())
            context.setVariable((String)key, ctxVars.get(key));

        final var output = templateEngine.process("DeliveryCompletionEmail.html",context);
        for(var key : ctxVars.keySet())
            assertTrue(output.contains((String)ctxVars.get(key)));
        assertTrue(output.contains("</html>"));
        assertTrue(output.contains("</body>"));
    }

    @Test
    void testParcelStatusChangeEmail() {
        final var ctxVars = new HashMap<>();
        ctxVars.put("status", "CREATED");
        ctxVars.put("trackingCode", "HU10digitsand2letters");
        ctxVars.put("name", "testName");
        ctxVars.put("trackingUrl", "www.test.org");

        final var context = new Context();
        for(var key : ctxVars.keySet())
            context.setVariable((String)key, ctxVars.get(key));

        final var output = templateEngine.process("ParcelStatusChangedEmail.html", context);
        for(var key : ctxVars.keySet())
            assertTrue(output.contains((String)ctxVars.get(key)));
        assertTrue(output.contains("</html>"));
        assertTrue(output.contains("</body>"));
    }

    @Test
    void testPasswordChangeEmail() {
        final var ctxVars = new HashMap<>();
        ctxVars.put("resetLink", "www.reset_test.org");
        ctxVars.put("name", "testName");
        final var context = new Context();
        for(var key : ctxVars.keySet())
            context.setVariable((String)key, ctxVars.get(key));

        final var output = templateEngine.process("PasswordChangeRequestEmail.html", context);
        for(var key : ctxVars.keySet())
            assertTrue(output.contains((String)ctxVars.get(key)));
        assertTrue(output.contains("</html>"));
        assertTrue(output.contains("</body>"));
    }

    @Test
    void testShipmentCreationEmail() {
        final var ctxVars = new HashMap<>();
        ctxVars.put("trackingCode", "HU10digitsand2letters");
        ctxVars.put("name", "testName");
        ctxVars.put("trackingUrl", "www.tracking_test.org");

        final var context = new Context();
        for(var key : ctxVars.keySet())
            context.setVariable((String)key, ctxVars.get(key));

        final var output = templateEngine.process("ShipmentCreationEmail.html", context);
        for(var key : ctxVars.keySet())
            assertTrue(output.contains((String)ctxVars.get(key)));
        assertTrue(output.contains("</html>"));
        assertTrue(output.contains("</body>"));
    }

    @Test
    void testUserUpdatedEmail() {
        final var ctxVars = new HashMap<>();
        ctxVars.put("oldName", "testName");
        ctxVars.put("oldEmail", "test1@gmail.com");
        ctxVars.put("oldPhone", "06201234567");
        ctxVars.put("oldAddressLine1", "Test Road 69");
        ctxVars.put("oldAddressLine2", "2. emelet");
        ctxVars.put("oldAddressLine3", "Budapest 1234 Hungary");
        ctxVars.put("newName", "nameTest");
        ctxVars.put("newEmail", "test2@gmail.com");
        ctxVars.put("newPhone", "06207654321");
        ctxVars.put("newAddressLine1", "Test Road 96");
        ctxVars.put("newAddressLine2", "3. emelet");
        ctxVars.put("newAddressLine3", "Budapest 4321 Hungary");

        final var context = new Context();
        for(var key : ctxVars.keySet())
            context.setVariable((String)key, ctxVars.get(key));

        final var output = templateEngine.process("UserUpdatedEmail.html", context);
        for(var key : ctxVars.keySet())
            assertTrue(output.contains((String)ctxVars.get(key)));
        assertTrue(output.contains("</html>"));
        assertTrue(output.contains("</body>"));
    }

    @Test
    void testVerificationTokenEmail(){
        final var ctxVars = new HashMap<>();
        ctxVars.put("name", "testName");
        ctxVars.put("verifyLink", "www.verify.org");

        final var context = new Context();
        for(var key : ctxVars.keySet())
            context.setVariable((String)key, ctxVars.get(key));

        final var output = templateEngine.process("VerificationTokenEmail.html", context);
        for(var key : ctxVars.keySet())
            assertTrue(output.contains((String)ctxVars.get(key)));
        assertTrue(output.contains("</html>"));
        assertTrue(output.contains("</body>"));
    }
}
