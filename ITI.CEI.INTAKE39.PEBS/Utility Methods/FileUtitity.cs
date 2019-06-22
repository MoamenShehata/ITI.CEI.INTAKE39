using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace ITI.CEI.INTAKE39.PEBS.Utility_Methods
{
    public class FileUtitity
    {
        public static string CreateFolder(string userName)
        {
            string folderName = @"C:\Users\Ahmed Alaa\Desktop\AMR\PEBSDataBase";

            string pathString = System.IO.Path.Combine(folderName, userName);

            System.IO.Directory.CreateDirectory(pathString);

            return pathString;
        }
        public static void WriteFile(string file, string fileName, string pathString)
        {

            pathString = System.IO.Path.Combine(pathString, fileName);

            using (System.IO.StreamWriter myFile =
                new System.IO.StreamWriter(pathString))
            {
                myFile.Write(file);
            }


        }

        public static string ReadFile(string fileName, string userName)
        {
            string folderName = @"C:\Users\Ahmed Alaa\Desktop\AMR\PEBSDataBase";

            string pathString = System.IO.Path.Combine(folderName, userName);

            pathString = System.IO.Path.Combine(pathString, fileName) + ".txt";
            return System.IO.File.ReadAllText(pathString);
        }
        public static string ReadFile(string path)
        {

            return System.IO.File.ReadAllText(path);
        }

        public static string[] GetFilesNamesFromDirectory(string userName)
        {
            string pathString = System.IO.Path.Combine(@"C:\Users\Ahmed Alaa\Desktop\AMR\PEBStDataBase", userName);

            string[] filePaths = Directory.GetFiles(pathString, " *.txt");
            return filePaths;
        }
    }
}