using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ITI.CEI.INTAKE39.PEBS.Startup))]
namespace ITI.CEI.INTAKE39.PEBS
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
