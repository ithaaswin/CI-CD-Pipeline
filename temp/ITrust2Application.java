package edu.ncsu.csc.iTrust2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import edu.ncsu.csc.iTrust2.config.SchemaValidateIntegrator;

/**
 * Main entrypoint to the iTrust2 application
 *
 * @author Kai Presler-Marshall
 *
 */
@SpringBootApplication ( scanBasePackages = { "edu.ncsu.csc.iTrust2" } )
public class ITrust2Application extends SpringBootServletInitializer {

    /**
     * Main method
     *
     * @param args
     *            command-line arguments for Spring
     */
    public static void main ( final String[] args ) {
        SpringApplication.run( ITrust2Application.class, args );
    }
    
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ITrust2Application.class);
    }
    
    /**
     * Used to register a Schema Validator to make sure the database is
     * up-to-date
     *
     * @param schemaValidateIntegrator
     *            Schema Validator to register
     * @return Updated Hibernate properties file
     */
    @Bean
    public HibernatePropertiesCustomizer registerSchemaValidator (
            final SchemaValidateIntegrator schemaValidateIntegrator ) {
        return ( prop -> {
            prop.put( "hibernate.integrator_provider", schemaValidateIntegrator );
        } );
    }
}
