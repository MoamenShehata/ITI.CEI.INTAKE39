using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using ITI.CEI.INTAKE39.PEBS.Models;
using ITI.CEI.INTAKE39.PEBS.Models.Entities;
using ITI.CEI.INTAKE39.PEBS.Entities.ViewModels;
using IFC.Base;
using IFC.Geometry;
using IFC;
using ITI.CEI.INTAKE39.PEBS.Json;
using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;
using ITI.CEI.INTAKE39.PEBS.Utility_Methods;

namespace ITI.CEI.INTAKE39.PEBS.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private ApplicationDbContext _ctxt = new ApplicationDbContext();

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        public ActionResult RenderDimsView(string pName)
        {
            if (Request.IsAjaxRequest())
            {
                Models.Entities.Project project = new Models.Entities.Project();
                project.Name = pName;
                project.FK_PebsClientId = User.Identity.GetUserId();
                _ctxt.Projects.Add(project);
                _ctxt.SaveChanges();
                return PartialView("_PartialProjectDimensionProduction");
            }
            return null;
        }

        [HttpPost]
        public ActionResult RenderConfigView()
        {
            if (Request.IsAjaxRequest())
            {
                return PartialView("_PartialConfigProductionEditor");
            }
            return null;
        }

        [HttpPost]
        public ActionResult RenderBaysView()
        {
            if (Request.IsAjaxRequest())
            {
                return PartialView("_PartialProjectBaysProduction");
            }
            return null;
        }

        //[Authorize]
        //[HttpPost]
        //public ActionResult NewProject(string pName, ProjectType projectType)
        //{
        //    if (Request.IsAjaxRequest() && pName != "")
        //    {
        //        Project project = new Project(pName, projectType);
        //        project.FK_PebsClientId = User.Identity.GetUserId();
        //        _ctxt.Projects.Add(project);
        //        _ctxt.SaveChanges();
        //        return Json(new { View = View("_PartialProjectDimensionProduction"), Project = project, });
        //    }
        //    return Json("Failed");
        //}



        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            var result = await SignInManager.PasswordSignInAsync(model.LoginEmail, model.LoginPassword, model.RememberMe, shouldLockout: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid login attempt.");
                    return View(model);
            }
        }

        [HttpPost]
        public void DownloadIfc(JsonObject JsonData)
        {

            JsonObject y = new JsonObject();

            y.h1 = JsonData.h1;
            y.h2 = JsonData.h2;
            y.span = JsonData.span;
            y.Mybays = JsonData.Mybays;

            double[] spacing = new double[y.Mybays.Count + 1];
            double cumulative = 0;

            for (int b = 0; b < spacing.Length; b++)
            {
                spacing[b] = cumulative;
                if (b < spacing.Length - 1)
                {
                    cumulative += (y.Mybays[b].Width) * 1000;

                }
            }


            string Path = @"C:\Users\Ahmed Alaa\Desktop\tempAmrIsThatYou";
            Model model = Model.Create(Path);
            IFC.Base.Project project = IFC.Base.Project.Create(model);

            Site site = Site.Create(model);
            project.AddSite(site);

            Building build = Building.Create(model);
            site.AddBuilding(build);


            Storey storey2 = Storey.Create(model, 3000);

            build.AddStorey(storey2);
            Point pointcol1 = Point.Create(model, 0, 0, 0);

            //  double[] y = new double[] { 0.0, 5000.0, 8000.0, 12000.0, 15000.0, 18000.0, 20000.0, 25000.0 };

            Program.DrawFactory(model, storey2, y.h2, y.h1, y.span, pointcol1, spacing);
            model.Save(/*Path + $"{"Amr"}" + ".ifc"*/);


        }




        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes.
            // If a user enters incorrect codes for a specified amount of time then the user account
            // will be locked out for a specified amount of time.
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent: model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email, Name = model.ClientName };

                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    // Temp code
                    //var roleStore = new RoleStore<IdentityRole>(new ApplicationDbContext());
                    //var roleManager = new RoleManager<IdentityRole>(roleStore);
                    //await roleManager.CreateAsync(new IdentityRole("CanCreateProject"));
                    //await UserManager.AddToRoleAsync(user.Id, "CanCreateProject");

                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                    // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    return RedirectToAction("ProjectHomePage", "Account");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        //
        // GET: /Account/ForgotPassword
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return View("ForgotPasswordConfirmation");
                }

                // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                // string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                // var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                // await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");
                // return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ForgotPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetPassword(string code)
        {
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await UserManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                case SignInStatus.Failure:
                default:
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email });
            }
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("LaunchPage", "Account");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion

        #region Moamen


        public ActionResult ProjectHomePage()
        {
            var userRole = "";
            var userId = User.Identity.GetUserId();
            var user = _ctxt.Users.Find(userId);
            
            userRole = user.RoleType;
            if (userRole=="Admin")
            {
                ClientViewModel clientViewModel = new ClientViewModel();
                var Projects = _ctxt.Projects.ToList();
                foreach (var p in Projects)
                {
                    var client = _ctxt.Users.Find(p.FK_PebsClientId);
                    p.PebsClient = client;
                    
                }
                clientViewModel.Projects = Projects;
                return View("AdminHomePage", clientViewModel);

            }

            else
            {
                ClientViewModel clientViewModel = new ClientViewModel();
                clientViewModel.PebsClient = user;
                var projects = _ctxt.Projects.Where(p => p.FK_PebsClientId == user.Id).ToList();
                clientViewModel.PebsClient.Projects = projects;
                var reports = _ctxt.Reports;
                foreach (var project in projects)
                {
                    var projectReport = reports.Where(e => e.Projectid == project.Id).ToList().LastOrDefault();
                    project.Report = projectReport;
                }
                return View("ProjectHomePage", clientViewModel);

            }
        }


        public Report ViewReport(int id)
        {
            var report = _ctxt.Reports.Where(p => p.Projectid == id).LastOrDefault();
            return report;
        }
        [HttpPost]
        public ActionResult SaveModel(string projName)
        {
            var user = User.Identity.GetUserName();
            var xxs = Request;
            var projId = _ctxt.Projects.Where(p=>p.Name==projName).FirstOrDefault().Id;
            string jsonData = Request.Form[0];
            ///change this to username from the database
            string pathString = FileUtitity.CreateFolder(user);
            //string fileName=
            FileUtitity.WriteFile(jsonData, projName + "-" + projId + ".txt", pathString);

            return Json("valid saving");
        }


        [HttpPost]
        public void SendReport(Report r )
        {
            var project = _ctxt.Projects.Find(r.Projectid);
            project.Report = r;
            _ctxt.Reports.Add(r);
            _ctxt.SaveChanges();
            
        }

        [HttpPost]
        public string ViewModel(int id)
        {
            var project = _ctxt.Projects.Find(id);
            var user = _ctxt.Users.Find(project.FK_PebsClientId);
            var fileName = project.Name + "-" + project.Id;
            var modelString = FileUtitity.ReadFile(fileName, user.UserName);


            //var z = Request.Form;
            //var x = Request.Form[0];

            //string myFile = FileUtitity.ReadFile(x);

            return modelString;

        }

        public string ViewDetails(int id)
        {
            var project = _ctxt.Projects.Find(id);
            var user = _ctxt.Users.Find(project.FK_PebsClientId);
            var fileName = project.Name + "-" + project.Id;
            var modelString = FileUtitity.ReadFile(fileName, user.UserName);
            return modelString;

        }



        public ActionResult NewIFC() => View();

        [AllowAnonymous]
        public ActionResult LaunchPage() => View();
    }



    #endregion

    #region Oweda




    #endregion

    #region Alaa

    #endregion

    #region Rizk

    #endregion
}

