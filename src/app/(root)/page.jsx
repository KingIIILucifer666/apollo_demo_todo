"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useNhostClient } from "@nhost/nextjs";
import { useQuery, useMutation, useSubscription } from "@apollo/client";

import toast from "react-hot-toast";
import Image from "next/image";
import {
  DELETE_TODO,
  GET_USER_TODOS,
  UPDATE_TODO,
  SUBSCRIBE_TODOS,
} from "@/graphQL/queries";

export default function Home() {
  const [session, setSession] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [todos, setTodos] = useState([]);
  const [userId, setUserId] = useState("");

  const nhostClient = useNhostClient();

  // const { loading, error, data } = useQuery(GET_USER_TODOS, {
  //   variables: { userId },
  //   skip: !userId || userId.trim() === "", //Skips the user ID  If user ID is not defined / does not exist!
  // });

  const { loading, error, data } = useSubscription(SUBSCRIBE_TODOS, {
    variables: { userId },
    skip: !userId || userId.trim() === "",
  });

  const [updateTodo] = useMutation(UPDATE_TODO);

  const [deleteTodo] = useMutation(DELETE_TODO);

  useEffect(() => {
    setSession(nhostClient.auth.getSession());

    nhostClient.auth.onAuthStateChanged((_, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      const currentUserId = session.user?.id;
      setUserId(currentUserId || "");
      setAccessToken(session.accessToken);
    }
  }, [session]);

  useEffect(() => {
    if (accessToken) {
      nhostClient.graphql.setAccessToken(accessToken);
      nhostClient.storage.setAccessToken(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (data) {
      setTodos(data.todos || []);
    }
  }, [data]);

  const handleUpdateTodo = async (id) => {
    try {
      await updateTodo({
        variables: { id, user_id: userId },
      });
      toast.success("Todo updated successfully!");
    } catch (error) {
      toast.error("Failed to update Todo!");
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo({
        variables: { id, user_id: userId },
      });
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Todo!");
      console.error(error);
    }
  };

  const getFileUrl = (fileId) => {
    return nhostClient.storage.getPublicUrl({ fileId: fileId });
  };

  return (
    <div className="bg-zinc-800 h-screen w-full justify-between">
      <div className="w-full bg-black/20 px-28 py-5 inline-flex justify-center items-center gap-5">
        {typeof window !== "undefined" && session ? (
          <div className="w-full inline-flex justify-between">
            <Link
              href={{
                pathname: "/insert-todos",
                query: {
                  id: userId,
                },
              }}
              className="w-1/4"
            >
              INSERT TODOS
            </Link>

            <div className="w-2/4 text-center">
              <span>Welcome, {session.user?.email}</span>
            </div>
            <button
              className="w-1/4"
              onClick={async () => {
                try {
                  await nhostClient.auth.signOut();
                  console.log("signout successful");
                } catch (error) {
                  console.error("Error Logging out");
                }
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/signin">Sign In</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
      <div className="h-full flex justify-center items-start mt-20">
        <div>
          {session ? (
            <div>
              <div className="flex flex-col justify-center items-center p-10">
                ALL TODOS
              </div>
              {loading ? (
                <p>LoadingData...</p>
              ) : (
                <>
                  <div className="bg-zinc-500 w-full h-full flex flex-col justify-center rounded-xl md:p-6 p-4 overflow-y-auto no-scrollbar">
                    <table className="border-collapse w-full text-left text-xs bg-zinc-700 text-white rounded-lg shadow-lg">
                      <thead>
                        <tr className="uppercase border-b border-gray-600">
                          <th className="py-3 px-4 font-medium">ID</th>
                          <th className="py-3 px-4 font-medium">TITLE</th>
                          <th className="py-3 px-4 font-medium">COMPLETED</th>
                          <th className="py-3 px-4 font-medium">CREATED AT</th>
                          <th className="py-3 px-4 font-medium">UPDATED AT</th>
                          <th className="py-3 px-4 font-medium">Delete</th>
                          <th className="py-3 px-4 font-medium">Image</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todos ? (
                          todos.map((todo, index) => (
                            <tr key={index}>
                              <td className="py-3 px-4">{todo.id}</td>
                              <td className="py-3 px-4">{todo.title}</td>
                              <td className="py-3 px-4 inline-flex justify-center items-center gap-2">
                                <div
                                  className={` h-2 w-2 rounded-full ${
                                    todo.completed
                                      ? "bg-green-600"
                                      : "bg-red-600"
                                  }`}
                                ></div>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateTodo(todo.id)}
                                >
                                  Toggle
                                </button>
                              </td>
                              <td className="py-3 px-4">{todo.created_at}</td>
                              <td className="py-3 px-4">{todo.updated_at}</td>
                              <td className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTodo(todo.id)}
                                >
                                  Delete
                                </button>
                              </td>
                              <td>
                                <Image
                                  src={
                                    process.env.NEXT_PUBLIC_STORAGE_REF +
                                    todo.file_id
                                  }
                                  alt={`${todo.title} Image`}
                                  width={50}
                                  height={50}
                                  className="w-full h-full object-cover"
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <div>Please Insert Some Todo's</div>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href={"/signin"}>Please Login To Continue</Link>
          )}
        </div>
      </div>
    </div>
  );
}
